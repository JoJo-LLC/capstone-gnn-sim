@echo off
echo Stopping backend...
cd /d C:\DontStarveTogether\work\2025-19-ai-powered-structural-response-simulator\backend
docker compose down

echo Killing frontend (cargo tauri dev)...
taskkill /IM cargo.exe /F
taskkill /IM tauri.exe /F

echo Done.
