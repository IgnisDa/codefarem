import json
import os
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader, StrictUndefined

BASE_DIR = Path(__file__).parent
BASE_TEMPLATES_DIR = BASE_DIR / "templates"
BASE_DATA_DIR = BASE_DIR / "data"


data_environment = Environment(undefined=StrictUndefined)
template_environment = Environment(
    loader=FileSystemLoader(BASE_TEMPLATES_DIR), undefined=StrictUndefined
)


def write_dockerfile(template_name: str, app: str):
    base = template_environment.get_template(f"{template_name}.Dockerfile")
    with open(BASE_DATA_DIR / f"{app}.json") as f:
        template = data_environment.from_string(f.read())
        data = template.render(**os.environ)
        data = json.loads(data)
    apps = data["apps"]
    for context in apps:
        filename = data["dockerfile_path"].replace(
            "${executable}", context["EXECUTABLE_NAME"]
        )
        rendered = base.render(**context)
        with open(filename, mode="w", encoding="utf-8") as dockerfile:
            dockerfile.write(rendered)


@click.group()
def cli():
    """Generate docker-files for the various applications"""
    return


@click.command()
def admin_website():
    """Generate docker-files for the admin website"""
    write_dockerfile("admin-website", "admin-website")


@click.command()
def admin_backend():
    """Generate docker-files for the admin backend"""
    write_dockerfile("base", "admin-backend")


@click.command()
def authenticator():
    """Generate docker-files for the authenticator"""
    write_dockerfile("authenticator", "authenticator")


@click.command()
def compilers():
    """Generate docker-files for the compilers"""
    write_dockerfile("base", "compilers")


@click.command()
def executor():
    """Generate docker-files for the executor"""
    write_dockerfile("base", "executor")


@click.command()
def orchestrator():
    """Generate docker-files for the orchestrator"""
    write_dockerfile("orchestrator", "orchestrator")


@click.command()
def website():
    """Generate docker-files for the website"""
    write_dockerfile("website", "website")


cli.add_command(admin_backend)
cli.add_command(admin_website)
cli.add_command(authenticator)
cli.add_command(compilers)
cli.add_command(executor)
cli.add_command(orchestrator)
cli.add_command(website)

if __name__ == "__main__":
    cli()
