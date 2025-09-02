@echo off
echo Starting backend server...
cd /d C:\DontStarveTogether\work\2025-19-ai-powered-structural-response-simulator\backend
docker compose up --build -d

:: Wait a bit for backend to boot up (adjust timeout as needed)
echo Waiting for backend to start...
timeout /t 5 >nul

echo Starting frontend server...
cd /d C:\DontStarveTogether\work\2025-19-ai-powered-structural-response-simulator\frontend
cargo tauri dev
