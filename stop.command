

#!/bin/bash

# Dynamically get the directory of the script
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

echo "Stopping all running containers..."

# Stop containers launched via CPU and GPU docker-compose files
docker compose -f docker-compose.cpu.yml down
docker compose -f docker-compose.gpu.yml down

# Stop shared MongoDB container if still running
docker stop structural_sim_mongodb 2>/dev/null || true

echo "All containers stopped."