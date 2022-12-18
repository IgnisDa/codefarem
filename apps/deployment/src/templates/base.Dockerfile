FROM lukemathwalker/cargo-chef:latest-rust-1.65 AS chef
WORKDIR app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
{% include 'prepare-env.Dockerfile' %}
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release --bin {{ EXECUTABLE_NAME }} ;\
    strip target/release/{{ EXECUTABLE_NAME }}

{% block additional_step %}
{% endblock %}

FROM {{ IMAGE_NAME }} AS runtime
{% include 'prepare-env.Dockerfile' %}
WORKDIR app
{% block runtime_step %}
{% endblock %}
COPY --from=builder /app/target/release/{{ EXECUTABLE_NAME }} /usr/local/bin/{{ EXECUTABLE_NAME }}
CMD ["/usr/local/bin/{{ EXECUTABLE_NAME }}"]
