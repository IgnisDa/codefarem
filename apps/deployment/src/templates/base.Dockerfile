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

{% block additional_step %}
{% endblock %}

FROM {{ IMAGE_NAME }} AS runtime
{% for command in COMMANDS %}
RUN {{ command }}
{% endfor %}
WORKDIR app
{% block runtime_step %}
{% endblock %}
{% for name, value in ENVIRONMENT_VARIABLES.items() %}
ENV {{ name }}={{ value }}
{% endfor %}
COPY --from=builder /app/target/release/{{ EXECUTABLE_NAME }} /usr/local/bin/{{ EXECUTABLE_NAME }}
CMD ["/usr/local/bin/{{ EXECUTABLE_NAME }}"]
