FROM node:latest AS base
WORKDIR /app
RUN npm install --global @moonrepo/cli && moon --version

FROM base as builder
{% for name, value in ENVIRONMENT_VARIABLES.items() %}
ENV {{ name }}={{ value }}
{% endfor %}
WORKDIR /build
COPY . .
RUN moon setup
RUN moon run admin-website:build

FROM alpine:3.16 as deps
RUN wget "https://github.com/svenstaro/miniserve/releases/download/v0.22.0/miniserve-0.22.0-x86_64-unknown-linux-musl" -O "miniserve"
RUN chmod +x "miniserve"

FROM alpine:3.16
WORKDIR /srv
COPY --from=builder /build/apps/admin/website/dist ./
COPY --from=deps /miniserve /usr/bin/miniserve
CMD miniserve --index index.html --spa --port $PORT /srv
