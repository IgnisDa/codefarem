import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const mappings = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default
  {
    moduleNameMapper: mappings,
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
