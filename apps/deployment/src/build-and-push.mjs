#!/usr/bin/env zx

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { readFileSync } from 'node:fs';
import { globby } from 'globby';
import minimist from 'minimist';
import { $ } from 'zx';

const argv = minimist(process.argv.slice(3));
const executable = argv._[0];

const { REGISTRY, ACTOR } = $.env;

const imageName =
  `${REGISTRY}/${ACTOR}/codefarem--${executable}:latest`.toLowerCase();

let dockerfilePath = null;

const globs = await globby('apps/deployment/src/data/*.json');
for (const file of globs) {
  const contents = JSON.parse(readFileSync(file, 'utf8'));
  const executablesInFile = contents.apps.flatMap(
    (app) => app.EXECUTABLE_NAMES
  );
  if (executablesInFile.includes(executable)) {
    dockerfilePath = contents.dockerfile_path;
    break;
  }
}

if (!dockerfilePath)
  throw new Error(`Could not find Dockerfile for ${executable}`);

await $`docker build --tag '${imageName}' --file '${dockerfilePath}' .`;
await $`docker push '${imageName}'`;
