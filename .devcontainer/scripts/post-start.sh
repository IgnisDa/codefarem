#!/usr/bin/env bash

cd apps/farem-main
edgedb instance start -I $(edgedb project info --instance-name)
echo "Edgedb database started for farem-main..."
