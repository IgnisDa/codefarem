FROM ghcr.io/teamhanko/hanko:main as builder

FROM stephenc/envsub as deps

FROM ubuntu as runner
RUN apt-get update ;\
    apt-get install -y ca-certificates curl tar ;\
    rm -rf /var/lib/apt/lists/* ;\
    update-ca-certificates
RUN curl -L "https://github.com/IgnisDa/rust-libs/releases/download/v0.3.0%2Bconnection-string-parser/connection-string-parser-x86_64-unknown-linux-musl.tar.gz" --output csp.tar.gz
RUN tar -xvf csp.tar.gz
RUN mv connection-string-parser /usr/local/bin/csp
WORKDIR /service
COPY --from=deps /bin/envsub /bin/envsub
COPY --from=builder /hanko /bin/hanko
COPY apps/authenticator/* ./
CMD /service/set-env-and-start.sh hanko serve public
