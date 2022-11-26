FROM lukemathwalker/cargo-chef:latest AS chef
RUN rustup default nightly
WORKDIR app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release --bin {{ EXECUTABLE_NAME }} ;\
    strip target/release/{{ EXECUTABLE_NAME }}

{% block body %}

{% endblock %}
