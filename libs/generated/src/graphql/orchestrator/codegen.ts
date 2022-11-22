import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    config: {
        scalars: {
            UUID: 'string',
        }
    },
    documents: ["./src/graphql/orchestrator/{queries,mutations}.ts"],
    generates: {
        './src/graphql/orchestrator/generated/': {
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
