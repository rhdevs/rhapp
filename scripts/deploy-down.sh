#!/usr/bin/bash
# Stop all production instances of NUSMods.
# Usage: prod-down.sh

# Exit when any command fails
set -e

# Echo commands
set -x

# Prune all previous builds - use this when doing heavy debugging
docker system prune --all --force

# Stop docker-compose
docker compose --project-name=blue    down --remove-orphans
docker compose --project-name=purple    down --remove-orphans
docker compose --project-name=green   down --remove-orphans
docker compose --project-name=mech down --remove-orphans
docker compose --project-name=machine down --remove-orphans
