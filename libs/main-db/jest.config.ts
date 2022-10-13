export default {
  displayName: 'main-db',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  globalSetup: '<rootDir>/tests/setup.ts',
  globalTeardown: '<rootDir>/tests/teardown.ts',
  coverageDirectory: '../../coverage/libs/main-db',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
