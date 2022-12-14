#!/usr/bin/env zx

import { readFileSync } from 'node:fs';
import { globby } from 'globby';
import { $ } from 'zx';

const { REGISTRY, ACTOR } = $.env;

const globs = await globby('apps/deployment/src/data/*.json');

const allExecutables = globs.flatMap((file) => {
  const contents = JSON.parse(readFileSync(file, 'utf8'));
  return contents.apps.flatMap((app) => app.EXECUTABLE_NAMES);
});

for (const executable of allExecutables) {
  const imageName =
    `${REGISTRY}/${ACTOR}/codefarem--${executable}:latest`.toLowerCase();
  let dockerfilePath = null;
  for (const file of globs) {
    const contents = JSON.parse(readFileSync(file, 'utf8'));
    const executablesInFile = contents.apps.flatMap(
      (app) => app.EXECUTABLE_NAMES
    );
    if (executablesInFile.includes(executable)) {
      dockerfilePath = contents.dockerfile_path.replace(
        '${executable}',
        executable
      );
      break;
    }
  }
  if (!dockerfilePath)
    throw new Error(`Could not find Dockerfile for ${executable}`);
  await $`docker buildx build --cache-from type=gha --cache-to type=gha,mode=max --file '${dockerfilePath}' --tag '${imageName}' --push .`;
}
