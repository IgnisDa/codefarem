export default
{
  displayName: 'main-db',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
    collectCoverageFrom: [
    "<rootDir>/tests",
    "!<rootDir>/node_modules",
    "!<rootDir>/dbschema",
  ],
  globalSetup: '<rootDir>/tests/setup.ts',
  globalTeardown: '<rootDir>/tests/teardown.ts',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
