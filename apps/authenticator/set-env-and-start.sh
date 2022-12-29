#!/usr/bin/env sh

export DATABASE_USER=$(connection-string-parser $DATABASE_URL --part user)
export DATABASE_PASSWORD=$(connection-string-parser $DATABASE_URL --part password)
export DATABASE_HOST=$(connection-string-parser $DATABASE_URL --part host)
export DATABASE_PORT=$(connection-string-parser $DATABASE_URL --part port)
export DATABASE_NAME=$(connection-string-parser $DATABASE_URL --part path)

mkdir -p /service/config

(cat /service/config.yml) | envsub --greedy-defaults > /service/config/config.yaml

echo "Wrote configuration..."

echo "Starting service..."
exec $@
