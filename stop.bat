@echo off
echo Stopping backend...
cd /d %~dp0backend
set /p mode="Which mode did you launch (cpu/gpu)? "
docker compose --profile %mode% down

echo Killing frontend (cargo tauri dev)...
taskkill /IM cargo.exe /F
taskkill /IM tauri.exe /F

echo Done.
