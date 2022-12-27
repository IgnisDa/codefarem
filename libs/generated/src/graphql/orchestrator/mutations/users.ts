import { graphql } from '../generated';

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
