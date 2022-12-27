import { join, resolve } from 'node:path';

export const definitionsLibraryPath = join(
  // eslint-disable-next-line unicorn/prefer-module
  resolve(__dirname, '../../../'),
  'graphql',
  'src'
);
