import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const mappings = pathsToModuleNameMapper(compilerOptions.paths)

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default
  {
    roots: ['<rootDir>'],
    moduleNameMapper: mappings,
    modulePaths: [compilerOptions.baseUrl],
    displayName: 'main-db',
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.json',
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
