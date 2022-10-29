/* eslint-disable */
export default {
  testEnvironment: 'jsdom',
  displayName: 'react-ui',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/dist'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
