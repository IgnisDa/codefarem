import { graphql } from '../generated';

export const EXECUTE_CODE = graphql(`
  mutation ExecuteCode($input: ExecuteCodeInput!) {
    executeCode(input: $input) {
      __typename
      ... on ExecuteCodeOutput {
        output
        time {
          compilation
          execution
        }
      }
      ... on ExecuteCodeError {
        error
        step
      }
    }
  }
`);
