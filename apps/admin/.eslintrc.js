module.exports = {
  rules: {
    'import/no-default-export': ['off'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  extends: 'next',
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
};
