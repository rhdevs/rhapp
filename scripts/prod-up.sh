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

docker compose --project-name=machine -f $WORK_DIR/infra/network/docker-compose.yml build --no-cache
docker compose --project-name=machine -f $WORK_DIR/infra/network/docker-compose.yml --env-file ${WORK_DIR}/secrets/.env up --force-recreate -d
docker compose --project-name=blue    -f $WORK_DIR/docker-compose.yml          build --no-cache
docker compose --project-name=blue    -f $WORK_DIR/docker-compose.yml          up -d
