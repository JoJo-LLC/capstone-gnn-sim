

#!/bin/bash

echo "Select execution mode:"
echo "1. CPU"
echo "2. GPU"
read -p "Enter your choice [1-2]: " choice

if [ "$choice" == "1" ]; then
  echo "Starting in CPU mode..."
  docker compose -f docker-compose.cpu.yml up --build
elif [ "$choice" == "2" ]; then
  echo "Starting in GPU mode..."
  docker compose -f docker-compose.gpu.yml up --build
else
  echo "Invalid choice. Exiting."
  exit 1
fi