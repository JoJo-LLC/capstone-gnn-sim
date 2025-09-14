@echo off
echo Choose execution mode:
echo 1. CPU
echo 2. GPU
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Starting backend (CPU mode)...
    cd /d "%~dp0"
    docker compose --profile base --profile cpu up --build -d
) else if "%choice%"=="2" (
    echo Starting backend (GPU mode)...
    cd /d "%~dp0"
    docker compose --profile base --profile gpu up --build -d
) else (
    echo Invalid choice. Exiting.
    exit /b
)

:: Wait for backend to boot
echo Waiting for backend to start...
timeout /t 5 >nul

:: Start frontend (Tauri)
echo Starting frontend server...
cd /d "%~dp0frontend\\tauri-app"
cargo tauri dev
