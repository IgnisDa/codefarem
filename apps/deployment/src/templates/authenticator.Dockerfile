FROM ghcr.io/teamhanko/hanko:main as builder

FROM stephenc/envsub as deps

FROM ubuntu as runner
COPY --from=deps /bin/envsub /bin/envsub
COPY --from=builder /hanko .
COPY apps/authenticator/start.sh .
COPY apps/authenticator/config.yml .
ENTRYPOINT ["/start.sh"]
