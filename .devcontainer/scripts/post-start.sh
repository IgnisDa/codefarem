#!/usr/bin/env bash

cd libs/main-db
edgedb instance start -I $(edgedb project info --instance-name)
echo "Main database started..."
