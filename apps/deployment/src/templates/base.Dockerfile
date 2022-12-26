{% block additional_step %}
{% endblock %}

FROM {{ IMAGE_NAME }} AS runtime
{% for name, value in ENVIRONMENT_VARIABLES.items() %}
ENV {{ name }}={{ value }}
{% endfor %}
{% for command in COMMANDS %}
RUN {{ command }}
{% endfor %}
WORKDIR app
{% block runtime_step %}
{% endblock %}
COPY target/release/{{ EXECUTABLE_NAME }} /usr/local/bin/{{ EXECUTABLE_NAME }}
CMD ["/usr/local/bin/{{ EXECUTABLE_NAME }}"]
