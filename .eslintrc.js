module.exports = {
  root: true, // Required!
  extends: ['moon'],
  rules: {
    'no-console': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
  },

  // TypeScript support
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
};
