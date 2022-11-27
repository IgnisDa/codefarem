FROM node:latest AS base
WORKDIR /app
ENV PROJECT_NAME=website
RUN npm install -g @moonrepo/cli

FROM base AS workspace
WORKDIR /app
COPY . .
RUN moon docker scaffold website

FROM base AS builder
WORKDIR /app
COPY --from=workspace /app/.moon/docker/workspace .
RUN moon setup
COPY --from=workspace /app/.moon/docker/sources .
RUN moon run $PROJECT_NAME:build
RUN moon docker prune

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/${PROJECT_NAME}/ci/* ./
COPY --from=builder /app/apps/${PROJECT_NAME}/build/* ./
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production

CMD /app/start.sh
