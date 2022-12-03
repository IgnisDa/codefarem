FROM ghcr.io/teamhanko/hanko:main as builder

FROM ubuntu as runner
RUN apt update && apt install -y gettext
COPY --from=builder /hanko .
COPY apps/authenticator/start.sh .
COPY apps/authenticator/config.yml .
ENTRYPOINT ["/start.sh"]
