#!/usr/bin/env zx

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { readFileSync } from 'node:fs';
import { basename, parse } from 'node:path';
import { globby } from 'globby';
import minimist from 'minimist';
import { $ } from 'zx';

const argv = minimist(process.argv.slice(3));

const projectType = argv._[0];

const globs = await globby('apps/deployment/src/data/*.json');

const allProjectExecutables = globs
  .filter((file) => {
    const contents = JSON.parse(readFileSync(file, 'utf8'));
    return contents.project_type === projectType;
  })
  .map((file) => ({ file, projectName: parse(basename(file)).name }));

for (const executable of allProjectExecutables) {
  if (projectType === 'rust') {
    await $`cargo build --release --package ${executable.projectName}`;
  } else if (projectType === 'nodejs') {
    await $`moon run ${executable.projectName}:build`;
  }
}
