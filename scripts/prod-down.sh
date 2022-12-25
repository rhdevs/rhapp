#!/usr/bin/bash
# Stop all production instances of NUSMods.
# Usage: prod-down.sh

# Exit when any command fails
set -e

# Echo commands
set -x

# Start docker-compose
docker compose --project-name=blue    -f docker-compose.yml down
docker compose --project-name=green   -f docker-compose.yml down
docker compose --project-name=machine -f ../infra/network/docker-compose.yml down --remove-orphans
