#!/usr/bin/bash
# Generates the most recent logs
# Usage: ./generate-logs.sh

set -e

set -x

dir=~/data/logs
filename1=$dir/dev_output.txt
filename2=$dir/prod_output.txt

if [ ! -f $filename1 ]; then
    mkdir -p $dir
    sudo touch $filename1
    sudo chmod 600 $filename1
fi

if [ ! -f $filename2 ]; then
    sudo touch $filename2
    sudo chmod 600 $filename2
fi


docker logs purple-backend-dev-1 2>&1 | grep -v 'metrics' >> $filename1
docker logs blue-backend-prod-1 2>&1 | grep -v 'metrics' >> $filename2
