@echo off
setlocal

:: Dynamically set PROJECT_DIR to the directory containing this script
set "PROJECT_DIR=%~dp0"
:: Remove trailing backslash if it exists
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

:: Stop any container publishing on port 8000
for /f "tokens=*" %%i in ('docker ps --filter "publish=8000" -q') do docker stop %%i

echo Select execution mode:
echo 1. CPU
echo 2. GPU
set /p mode=Enter your choice [1-2]: 

cd /d "%PROJECT_DIR%"

if "%mode%"=="1" (
    echo Starting in CPU mode...
    docker compose -f docker-compose.cpu.yml up --build -d
) else if "%mode%"=="2" (
    echo Starting in GPU mode...
    docker compose -f docker-compose.gpu.yml up --build -d
) else (
    echo Invalid selection. Exiting.
    exit /b 1
)

:: Wait a bit to make sure backend is up
timeout /t 2 /nobreak >nul

:: Launch the Tauri frontend app
cd /d "%PROJECT_DIR%\frontend\tauri-app"
cargo tauri dev

endlocal
