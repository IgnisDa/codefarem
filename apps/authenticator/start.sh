#!/usr/bin/env sh

export DATABASE_USER=$(echo $DATABASE_URL | grep -oP "postgres://\K(.+?):" | cut -d: -f1)
export DATABASE_PASSWORD=$(echo $DATABASE_URL | grep -oP "postgres://.*:\K(.+?)@" | cut -d@ -f1)
export DATABASE_HOST=$(echo $DATABASE_URL | grep -oP "postgres://.*@\K(.+?):" | cut -d: -f1)
export DATABASE_PORT=$(echo $DATABASE_URL | grep -oP "postgres://.*@.*:\K(\d+)/" | cut -d/ -f1)
export DATABASE_NAME=$(echo $DATABASE_URL | grep -oP "postgres://.*@.*:.*/\K(.+?)$")

mkdir -p /config

envsubst < /config.yml > /config/config.yaml

/hanko migrate up
/hanko serve public
