import json
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader, StrictUndefined

BASE_DIR = Path(__file__).parent
BASE_TEMPLATES_DIR = BASE_DIR / "templates"
BASE_DATA_DIR = BASE_DIR / "data"


environment = Environment(
    loader=FileSystemLoader(BASE_TEMPLATES_DIR), undefined=StrictUndefined
)


@click.group()
def cli():
    """Generate docker-files for the various applications"""
    return


@click.command()
def compilers():
    """Generate docker-files for the compilers"""
    base = environment.get_template("base.Dockerfile")
    with open(BASE_DATA_DIR / "compilers.json") as f:
        data = json.load(f)
    apps = data["apps"]
    for context in apps:
        filename = data["dockerfile_path"].replace(
            "{{ executable }}", context["EXECUTABLE_NAME"]
        )
        rendered = base.render(**context)
        with open(filename, mode="w", encoding="utf-8") as dockerfile:
            dockerfile.write(rendered)


@click.command()
def executor():
    """Generate docker-files for the executor"""
    base = environment.get_template("base.Dockerfile")
    with open(BASE_DATA_DIR / "executor.json") as f:
        data = json.load(f)
    apps = data["apps"]
    for context in apps:
        filename = data["dockerfile_path"]
        rendered = base.render(**context)
        with open(filename, mode="w", encoding="utf-8") as dockerfile:
            dockerfile.write(rendered)


@click.command()
def orchestrator():
    """Generate docker-files for the orchestrator"""
    base = environment.get_template("base.Dockerfile")
    with open(BASE_DATA_DIR / "orchestrator.json") as f:
        data = json.load(f)
    apps = data["apps"]
    for context in apps:
        filename = data["dockerfile_path"]
        rendered = base.render(**context)
        with open(filename, mode="w", encoding="utf-8") as dockerfile:
            dockerfile.write(rendered)


@click.command()
def website():
    """Generate docker-files for the website"""
    base = environment.get_template("website.Dockerfile")
    with open(BASE_DATA_DIR / "website.json") as f:
        data = json.load(f)
    context = {}
    filename = data["dockerfile_path"]
    rendered = base.render(**context)
    with open(filename, mode="w", encoding="utf-8") as dockerfile:
        dockerfile.write(rendered)


cli.add_command(compilers)
cli.add_command(executor)
cli.add_command(orchestrator)
cli.add_command(website)

if __name__ == "__main__":
    cli()