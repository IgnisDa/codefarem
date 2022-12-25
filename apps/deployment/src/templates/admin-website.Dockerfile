FROM alpine:3.16 as deps
RUN wget "https://github.com/svenstaro/miniserve/releases/download/v0.22.0/miniserve-0.22.0-x86_64-unknown-linux-musl" -O "miniserve"
RUN chmod +x "miniserve"

FROM alpine:3.16
WORKDIR /srv
COPY apps/admin/website/dist ./
COPY --from=deps /miniserve /usr/bin/miniserve
CMD miniserve --index index.html --spa --port $PORT --verbose /srv
