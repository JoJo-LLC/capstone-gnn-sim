// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::path::PathBuf;
use tauri::{command, Manager};
use dirs;
use which::which;

fn get_compose_contents(mode: &str) -> Result<String, String> {
    match mode {
        "cpu" => Ok(String::from_utf8(include_bytes!(concat!(env!("CARGO_MANIFEST_DIR"), "/docker-compose.cpu.yml")).to_vec())
            .map_err(|e| format!("❌ Invalid UTF-8 in CPU compose file: {}", e))?),
        "gpu" => Ok(String::from_utf8(include_bytes!(concat!(env!("CARGO_MANIFEST_DIR"), "/docker-compose.gpu.yml")).to_vec())
            .map_err(|e| format!("❌ Invalid UTF-8 in GPU compose file: {}", e))?),
        _ => Err("❌ Unknown mode".to_string()),
    }
}

#[command]
fn start_backend_shell(app_handle: tauri::AppHandle, mode: String) -> Result<serde_json::Value, String> {
    println!("🧠 Received mode: {}", mode);
    let resource_dir = match app_handle.path().resource_dir() {
        Ok(path) => path,
        Err(e) => return Err(format!("❌ Failed to resolve resource dir: {}", e)),
    };
    println!("📁 resourceDirPath: {}", resource_dir.display());
    println!("🧠 Invoking backend with: mode={}, resourceDirPath={}", mode, resource_dir.display());

    // Create persistent data directory for user data (input & output files)
    let home_dir = dirs::home_dir().ok_or("❌ Could not find home directory")?;
    let base_dir = home_dir.join("Documents").join("StructuralResponseSimulator");
    let data_dir = base_dir.join("data");
    let models_dir = base_dir.join("models");

    if !data_dir.exists() {
        std::fs::create_dir_all(&data_dir)
            .map_err(|e| format!("❌ Failed to create data directory: {}", e))?;
        println!("📂 Created persistent data directory: {}", data_dir.display());
        println!("💡 Place your input data folders (e.g., 0.4_6) in: {}", data_dir.display());
    }

    if !models_dir.exists() {
        std::fs::create_dir_all(&models_dir)
            .map_err(|e| format!("❌ Failed to create models directory: {}", e))?;
        println!("📂 Created models directory: {}", models_dir.display());
        println!("💡 Place your custom model folders (e.g., custom_model/) in: {}", models_dir.display());
    }

    // Copy backend code (excluding large data) to temp directory
    let temp_dir = home_dir.join(".srs_backend_tmp");

    if temp_dir.exists() {
        std::fs::remove_dir_all(&temp_dir).map_err(|e| format!("❌ Failed to clean temp dir: {}", e))?;
    }

    std::fs::create_dir_all(&temp_dir).map_err(|e| format!("❌ Failed to create temp dir: {}", e))?;

    let compose_filename = match mode.as_str() {
        "cpu" => "docker-compose.cpu.yml",
        "gpu" => "docker-compose.gpu.yml",
        _ => return Err("❌ Invalid mode. Expected 'cpu' or 'gpu'.".into()),
    };

    let source_compose = resource_dir.join(compose_filename);
    let dest_compose = temp_dir.join(compose_filename);

    std::fs::copy(&source_compose, &dest_compose)
        .map_err(|e| format!("❌ Failed to copy compose file: {}", e))?;

    let backend_source = resource_dir.join("backend");
    let backend_dest = temp_dir.join("backend");

    if !backend_source.exists() {
        return Err(format!("❌ Backend directory not found: {}", backend_source.display()));
    }

    // Copy backend code only (excluding large data folders like 0.4_6)
    copy_backend_code(&backend_source, &backend_dest)
        .map_err(|e| format!("❌ Failed to copy backend directory: {}", e))?;

    let compose_path = temp_dir.join(compose_filename);

    run_docker_commands(compose_path, data_dir, models_dir)
}

fn run_docker_commands(path: std::path::PathBuf, data_dir: PathBuf, models_dir: PathBuf) -> Result<serde_json::Value, String> {
    println!("🔧 Running Docker commands for: {:?}", path);
    println!("🔍 Will run docker-compose using: {}", path.display());
    println!("📂 Data directory for Docker mount: {}", data_dir.display());
    println!("📂 Models directory for Docker mount: {}", models_dir.display());
    let parent_dir = path.parent().unwrap_or(std::path::Path::new("."));

    let docker_compose = which("docker-compose").or_else(|_| {
        let fallback = "/usr/local/bin/docker-compose";
        if PathBuf::from(fallback).exists() {
            Ok(PathBuf::from(fallback))
        } else {
            Err(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "cannot find binary path",
            ))
        }
    }).map_err(|e| format!("❌ Could not locate docker-compose in PATH or fallback: {}", e))?;

    // Set DATA_DIR and MODELS_DIR environment variables for docker-compose
    let data_dir_str = data_dir.to_string_lossy().to_string();
    let models_dir_str = models_dir.to_string_lossy().to_string();

    // Best-effort: tear down any previous compose project for this compose file to avoid port conflicts
    // NOTE: Removed -v flag to preserve MongoDB data volume
    match Command::new(&docker_compose)
        .arg("-f")
        .arg(&path)
        .arg("down")
        .arg("--remove-orphans")
        .current_dir(parent_dir)
        .env("DATA_DIR", &data_dir_str)
        .env("MODELS_DIR", &models_dir_str)
        .status()
    {
        Ok(s) => println!("docker-compose down status: {:?}", s),
        Err(e) => println!("docker-compose down failed: {}", e),
    }

    let output = Command::new(&docker_compose)
        .arg("-f")
        .arg(&path)
        .arg("build")
        .current_dir(parent_dir)
        .env("DATA_DIR", &data_dir_str)
        .env("MODELS_DIR", &models_dir_str)
        .output()
        .map_err(|e| format!("❌ Failed to run docker-compose build: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        return Err(format!(
            "❌ Docker build failed for {:?}\n--- STDOUT ---\n{}\n--- STDERR ---\n{}",
            path, stdout, stderr
        ));
    }

    let up_status = Command::new(&docker_compose)
        .arg("-f")
        .arg(&path)
        .arg("up")
        .arg("-d")
        .current_dir(parent_dir)
        .env("DATA_DIR", &data_dir_str)
        .env("MODELS_DIR", &models_dir_str)
        .status()
        .map_err(|e| format!("Failed to start containers with {:?}: {}", path, e))?;

    if up_status.success() {
        Ok(serde_json::json!({ "status": "ok" }))
    } else {
        Err(format!("Docker up failed for {:?}", path))
    }
}

fn copy_dir_all(src: &std::path::Path, dst: &std::path::Path) -> std::io::Result<()> {
    std::fs::create_dir_all(dst)?;
    for entry in std::fs::read_dir(src)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let dst_entry = dst.join(entry.file_name());
        if file_type.is_dir() {
            copy_dir_all(&entry.path(), &dst_entry)?;
        } else {
            std::fs::copy(entry.path(), dst_entry)?;
        }
    }
    Ok(())
}

fn copy_backend_code(src: &std::path::Path, dst: &std::path::Path) -> std::io::Result<()> {
    std::fs::create_dir_all(dst)?;

    // List of folders to exclude (large data folders)
    let exclude_folders = vec!["0.4_6", "output", "GNN-output-REAL"];

    for entry in std::fs::read_dir(src)? {
        let entry = entry?;
        let file_name = entry.file_name();
        let file_name_str = file_name.to_string_lossy();

        // Skip excluded folders
        if exclude_folders.contains(&file_name_str.as_ref()) {
            println!("⏭️  Skipping large data folder: {}", file_name_str);
            continue;
        }

        let file_type = entry.file_type()?;
        let dst_entry = dst.join(&file_name);

        if file_type.is_dir() {
            copy_dir_all(&entry.path(), &dst_entry)?;
        } else {
            std::fs::copy(entry.path(), dst_entry)?;
        }
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_backend_shell])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
