FROM node:latest AS base
WORKDIR /app
RUN npm install -g @moonrepo/cli

FROM base as builder
{% for name, value in ENVIRONMENT_VARIABLES.items() %}
ENV {{ name }}={{ value }}
{% endfor %}
WORKDIR /build
COPY . .
RUN moon setup
RUN moon run admin-website:build

FROM alpine:3.16 as deps
RUN apk add wget
RUN wget https://github.com/weihanglo/sfz/releases/download/v0.7.1/sfz-v0.7.1-x86_64-unknown-linux-musl.tar.gz
RUN tar -xzf sfz-v0.7.1-x86_64-unknown-linux-musl.tar.gz

FROM alpine:3.16
WORKDIR /srv
COPY --from=builder /build/apps/admin/website/dist ./
COPY --from=deps /sfz /usr/bin/sfz
CMD sfz --no-ignore --bind 0.0.0.0 --port $PORT --render-index /srv
