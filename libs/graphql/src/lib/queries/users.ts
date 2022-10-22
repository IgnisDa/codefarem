import { gql } from 'urql';

export const LOGIN_USER = gql`
  query LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      __typename
      ... on LoginUserOutput {
        token
      }
      ... on LoginUserError {
        error
      }
    }
  }
`;

export const USER_DETAILS = gql`
  query UserDetails {
    userDetails {
      __typename
      ... on UserDetailsOutput {
        accountType
        profile {
          email
          username
        }
      }
      ... on ApiError {
        error
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  query LogoutUser {
    logoutUser
  }
`;

export const USER_WITH_EMAIL = gql`
  query UserWithEmail($input: UserWithEmailInput!) {
    userWithEmail(input: $input) {
      __typename
      ... on UserWithEmailOutput {
        id
      }
      ... on UserWithEmailError {
        error
      }
    }
  }
`;
