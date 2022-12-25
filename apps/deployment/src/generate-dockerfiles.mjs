#!/usr/bin/env zx

import { globby } from 'globby';
import { $ } from 'zx';

const globs = await globby('apps/deployment/src/data/*.json');
for (const file of globs) {
  // get the filename without extension
  const filename = file.split('/').pop().split('.').shift();
  await $`poetry run python apps/deployment/src/docker.py "${filename}"`;
}
