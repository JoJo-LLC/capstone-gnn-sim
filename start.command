#!/bin/bash

# Dynamically set PROJECT_DIR to the directory containing this script
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
docker stop $(docker ps --filter "publish=8000" -q)

echo "Select execution mode:"
echo "1. CPU"
echo "2. GPU"
read -p "Enter your choice [1-2]: " mode

cd "$PROJECT_DIR"

if [ "$mode" == "1" ]; then
  echo "Starting in CPU mode..."
  docker compose -f docker-compose.cpu.yml up --build -d
elif [ "$mode" == "2" ]; then
  echo "Starting in GPU mode..."
  docker compose -f docker-compose.gpu.yml up --build -d
else
  echo "Invalid selection. Exiting."
  exit 1
fi

# Wait a bit to make sure backend is up
sleep 2

# Launch the Tauri frontend app
cd "$PROJECT_DIR/frontend/tauri-app"
npx tauri dev