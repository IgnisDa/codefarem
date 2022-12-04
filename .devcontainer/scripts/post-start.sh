#!/usr/bin/env bash

cd libs/main-db
until edgedb instance start -I $(edgedb project info --instance-name)
do
    echo "Error starting instance, retrying..."
done
echo "Main database started..."
