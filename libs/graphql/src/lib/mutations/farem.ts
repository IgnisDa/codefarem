import { gql } from 'urql';

export const EXECUTE_CODE = gql`
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
`;
