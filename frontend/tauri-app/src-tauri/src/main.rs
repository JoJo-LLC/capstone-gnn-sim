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

    // Copy resources out of the .app bundle into a safe, Docker-accessible directory
    let home_dir = dirs::home_dir().ok_or("❌ Could not find home directory")?;
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

    copy_dir_all(&backend_source, &backend_dest)
        .map_err(|e| format!("❌ Failed to copy backend directory: {}", e))?;

    let compose_path = temp_dir.join(compose_filename);

    run_docker_commands(compose_path)
}

fn run_docker_commands(path: std::path::PathBuf) -> Result<serde_json::Value, String> {
    println!("🔧 Running Docker commands for: {:?}", path);
    println!("🔍 Will run docker-compose using: {}", path.display());
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

    // Best-effort: tear down any previous compose project for this compose file to avoid port conflicts
    match Command::new(&docker_compose)
        .arg("-f")
        .arg(&path)
        .arg("down")
        .arg("-v")
        .arg("--remove-orphans")
        .current_dir(parent_dir)
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_backend_shell])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
