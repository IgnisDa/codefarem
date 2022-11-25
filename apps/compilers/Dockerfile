FROM lukemathwalker/cargo-chef:latest AS chef
WORKDIR app

FROM chef AS planner
RUN rustup default nightly
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
RUN rustup default nightly
COPY . .
RUN cargo build --release --bin "rs-compiler" ;\
    strip target/release/"rs-compiler"

FROM debian:bullseye-slim AS runtime
WORKDIR app
COPY --from=builder /app/target/release/"rs-compiler" /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/rs-compiler"]
