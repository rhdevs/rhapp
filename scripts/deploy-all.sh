#!/usr/bin/bash
# Updates all instances without downtime

export WORK_DIR=~/rhapp/scripts

# Exit when any command fails
set -e

# Echo commands
set -x

cd $WORK_DIR

# Deploy Dev instance
./dev-deploy.sh

# sleep 2m 

# Deploy Prod instance
./prod-deploy.sh
