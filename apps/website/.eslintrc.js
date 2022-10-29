module.exports = {
  root: true,
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node'],
  // If using TypeScript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
