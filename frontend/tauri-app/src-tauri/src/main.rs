// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::command;

#[command]
fn start_backend_shell(mode: String) -> Result<serde_json::Value, String> {
    let compose_file = match mode.as_str() {
        "cpu" => "docker-compose.cpu.yml",
        "gpu" => "docker-compose.gpu.yml",
        _ => return Err("Invalid mode".into()),
    };

    let build_status = Command::new("docker-compose")
        .arg("-f")
        .arg(compose_file)
        .arg("build")
        .current_dir("../../../")
        .status()
        .map_err(|e| format!("Failed to build: {}", e))?;

    if !build_status.success() {
        return Err("Docker build failed".to_string());
    }

    let up_status = Command::new("docker-compose")
        .arg("-f")
        .arg(compose_file)
        .arg("up")
        .arg("-d")
        .current_dir("../../../")
        .status()
        .map_err(|e| format!("Failed to start containers: {}", e))?;

    if up_status.success() {
        Ok(serde_json::json!({ "status": "ok" }))
    } else {
        Err("Docker up failed".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_backend_shell])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
