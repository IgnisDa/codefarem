import { graphql } from ':generated/graphql/orchestrator';

export const USER_WITH_EMAIL = graphql(`
  query UserWithEmail($input: UserWithEmailInput!) {
    userWithEmail(input: $input) {
      __typename
      ... on UserWithEmailOutput {
        __typename
      }
      ... on UserWithEmailError {
        __typename
      }
    }
  }
`);

export const USER_DETAILS = graphql(`
  query UserDetails {
    userDetails {
      __typename
      ... on ApiError {
        error
      }
      ... on UserDetailsOutput {
        accountType
        profile {
          email
          username
        }
      }
    }
  }
`);
