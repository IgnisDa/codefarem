import json
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader, StrictUndefined

_base_dir = Path(__file__).parent / "templates"

DATA_FILENAME = "data.json"

compilers_environment = Environment(
    loader=FileSystemLoader(_base_dir), undefined=StrictUndefined
)


@click.group()
def cli():
    """Generate docker-files for the various applications"""
    pass


@click.command()
def compilers():
    """Generate docker-files for the compilers"""
    compilers_base = compilers_environment.get_template(
        "compilers/base.Dockerfile"
    )
    with open(_base_dir / "compilers" / DATA_FILENAME) as f:
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
    executor_base = compilers_environment.get_template("executor/Dockerfile")
    with open(_base_dir / "executor" / DATA_FILENAME) as f:
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
