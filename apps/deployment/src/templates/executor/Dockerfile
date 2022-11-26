{% extends 'base.Dockerfile' %}

{% block body %}
FROM {{ IMAGE_NAME }} AS runtime
{% for command in COMMANDS %}
RUN {{ command }}
{% endfor %}
WORKDIR app
ENV PORT=80
COPY --from=builder /app/target/release/{{ EXECUTABLE_NAME }} /usr/local/bin/{{ EXECUTABLE_NAME }}
ENTRYPOINT ["/usr/local/bin/{{ EXECUTABLE_NAME }}"]
{% endblock %}
