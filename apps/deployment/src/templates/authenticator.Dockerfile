FROM ghcr.io/teamhanko/hanko:main as builder

FROM stephenc/envsub as deps

FROM ubuntu as runner
RUN apt-get update ;\
    apt-get install -y ca-certificates ;\
    rm -rf /var/lib/apt/lists/* ;\
    update-ca-certificates
COPY --from=deps /bin/envsub /bin/envsub
COPY --from=builder /hanko .
COPY apps/authenticator/start.sh .
COPY apps/authenticator/config.yml .
ENTRYPOINT ["/start.sh"]