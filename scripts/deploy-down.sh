#!/usr/bin/bash
# Stop all production instances of NUSMods.
# Usage: prod-down.sh

# Exit when any command fails
set -e

# Echo commands
set -x

# Prune all previous builds
docker system prune --all --force

# Stop docker-compose
docker compose --project-name=blue    down
docker compose --project-name=green   down
docker compose --project-name=machine down --remove-orphans
