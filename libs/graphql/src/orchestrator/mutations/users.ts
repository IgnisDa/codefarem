import { graphql } from ':generated/graphql/orchestrator';

export const REGISTER_USER = graphql(`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      __typename
      ... on RegisterUserOutput {
        id
      }
      ... on ApiError {
        error
      }
    }
  }
`);
