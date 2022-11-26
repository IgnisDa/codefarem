import json
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader, StrictUndefined

BASE_DIR = Path(__file__).parent
BASE_TEMPLATES_DIR = BASE_DIR / "templates"
BASE_DATA_DIR = BASE_DIR / "data"


compilers_environment = Environment(
    loader=FileSystemLoader(BASE_TEMPLATES_DIR), undefined=StrictUndefined
)


@click.group()
def cli():
    """Generate docker-files for the various applications"""
    pass


@click.command()
def compilers():
    """Generate docker-files for the compilers"""
    compilers_base = compilers_environment.get_template("base.Dockerfile")
    with open(BASE_DATA_DIR / "compilers.json") as f:
        compilers_data = json.load(f)
    executable_data = compilers_data["apps"]
    for context in executable_data:
        filename = compilers_data["dockerfile_path"].replace(
            "{{ executable }}", context["EXECUTABLE_NAME"]
        )
        rendered = compilers_base.render(**context)
        with open(filename, mode="w", encoding="utf-8") as dockerfile:
            dockerfile.write(rendered)


@click.command()
def executor():
    """Generate docker-files for the executor"""
    executor_base = compilers_environment.get_template("base.Dockerfile")
    with open(BASE_DATA_DIR / "executor.json") as f:
        executor_data = json.load(f)
    context = executor_data["app"]
    filename = executor_data["dockerfile_path"]
    rendered = executor_base.render(**context)
    with open(filename, mode="w", encoding="utf-8") as dockerfile:
        dockerfile.write(rendered)


cli.add_command(compilers)
cli.add_command(executor)

if __name__ == "__main__":
    cli()
