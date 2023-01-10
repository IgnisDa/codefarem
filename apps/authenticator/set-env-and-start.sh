#!/usr/bin/env sh

export DATABASE_USER=$(csp $DATABASE_URL --part user)
export DATABASE_PASSWORD=$(csp $DATABASE_URL --part password)
export DATABASE_HOST=$(csp $DATABASE_URL --part host)
export DATABASE_PORT=$(csp $DATABASE_URL --part port)
export DATABASE_NAME=$(csp $DATABASE_URL --part path)

mkdir -p /service/config

(cat /service/config.yml) | envsub --greedy-defaults > /service/config/config.yaml

echo "Wrote configuration..."

echo "Starting service..."
exec $@
