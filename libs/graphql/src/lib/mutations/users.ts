import { gql } from 'urql';

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      __typename
      ... on RegisterUserOutput {
        id
      }
      ... on RegisterUserError {
        usernameNotUnique
        emailNotUnique
      }
    }
  }
`;
