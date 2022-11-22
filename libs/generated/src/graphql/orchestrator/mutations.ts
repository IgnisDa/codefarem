import { graphql } from './generated';

export const EXECUTE_CODE = graphql(`
  mutation ExecuteCode($input: ExecuteCodeInput!) {
    executeCode(input: $input) {
      __typename
      ... on ExecuteCodeOutput {
        output
      }
      ... on ExecuteCodeError {
        error
        step
      }
    }
  }
`);
