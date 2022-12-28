#!/usr/bin/bash
# Updates the development instance without downtime.
# Usage: dev-deploy.sh

export WORK_DIR=~/rhapp

# Exit when any command fails
set -e

# Echo commands
set -x

git pull
git checkout devel

# Change directory to the main directory
cd $WORK_DIR

# At the end of this script, we'll want to only keep cached builds of both the
# current and new deploys.
# --force simply disables confirmation.
docker system prune --all --force

# Build and deploy green, we have 2 versions now
export GIT_COMMIT_HASH=$(git rev-parse HEAD)
docker compose --project-name=green -f docker-compose.yml build --no-cache
docker compose --project-name=green -f docker-compose.yml up -d

# Wait for green to start
sleep 2m

# Restart purple, bringing it to latest
# Use cached build from green
docker compose --project-name=purple -f docker-compose.yml build
docker compose --project-name=purple -f docker-compose.yml down --remove-orphans
docker compose --project-name=purple -f docker-compose.yml up -d

# Wait for blue to start
sleep 2m

# Tear down green, we can now reuse it for next deploy
docker compose --project-name=green  -f docker-compose.yml down --remove-orphans
