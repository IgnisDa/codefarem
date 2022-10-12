export default {
  displayName: 'main-db',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/libs/main-db',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
