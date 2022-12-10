import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    config: {
        scalars: {
            UUID: 'string',
        }
    },
    documents: ["./src/graphql/admin/{queries,mutations}.ts"],
    generates: {
        './src/graphql/admin/generated/': {
            config: { skipTypename: true },
            plugins: [],
            preset: 'client',

        },
    },
    ignoreNoDocuments: true,
    overwrite: true,
    schema: 'http://127.0.0.1:5005',
};

// eslint-disable-next-line import/no-default-export
export default config;
