#!/usr/bin/bash
# Starts a production instance.
# Usage: prod-up.sh

export WORK_DIR=~/rhapp

# Exit when any command fails
set -e

# Echo commands
set -x

# Start docker-compose
export GIT_COMMIT_HASH=$(git rev-parse HEAD)
dir=~/data/traefik
filename=$dir/acme.json
if [ ! -f $filename ]; then
    mkdir -p $dir
    sudo touch $filename
    sudo chmod 600 $filename
fi

# Deploy Proxy
docker compose --project-name=machine -f $WORK_DIR/infra/network/docker-compose.yml build --no-cache
docker compose --project-name=machine -f $WORK_DIR/infra/network/docker-compose.yml up --force-recreate -d
# Deploy Production Backend
# git checkout main
docker compose --project-name=blue    -f $WORK_DIR/docker-compose.prod.yml          build --no-cache
docker compose --project-name=blue    -f $WORK_DIR/docker-compose.prod.yml          up -d
# Deploy Dev Backend
# git checkout devel
docker compose --project-name=blue    -f $WORK_DIR/docker-compose.yml          build --no-cache
docker compose --project-name=blue    -f $WORK_DIR/docker-compose.yml          up -d
