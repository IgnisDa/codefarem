{% for name, value in ENVIRONMENT_VARIABLES.items() %}
ENV {{ name }}={{ value }}
{% endfor %}
{% for command in COMMANDS %}
RUN {{ command }}
{% endfor %}
