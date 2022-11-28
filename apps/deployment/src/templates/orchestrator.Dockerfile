{% extends 'base.Dockerfile' %}

{% block additional_step %}
FROM edgedb/edgedb as downloader
{% endblock %}

{% block runtime_step %}
COPY --from=downloader /usr/bin/edgedb /usr/bin/edgedb
COPY libs/main-db/dbschema ./dbschema
COPY apps/orchestrator/Procfile ./Procfile
{% endblock %}
