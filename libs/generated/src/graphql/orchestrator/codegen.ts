import { join } from 'node:path';
import type { CodegenConfig } from '@graphql-codegen/cli';

import { definitionsLibraryPath } from '..';

const config: CodegenConfig = {
  config: {
    scalars: {
      UUID: 'string',
    },
  },
  documents: [
    join(definitionsLibraryPath, 'orchestrator/{queries,mutations}/*.ts'),
  ],
  generates: {
    './src/graphql/orchestrator/': {
      config: { skipTypename: true },
      plugins: [],
      preset: 'client',
    },
  },
  ignoreNoDocuments: true,
  overwrite: true,
  schema: 'http://127.0.0.1:8000/graphql',
};

// eslint-disable-next-line import/no-default-export
export default config;
