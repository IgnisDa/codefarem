import { graphql } from ':generated/graphql/orchestrator';

export const USER_WITH_EMAIL = graphql(`
  query UserWithEmail($input: UserWithEmailInput!) {
    userWithEmail(input: $input) {
      __typename
      ... on IdObject {
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

export const SEARCH_USER_DETAILS_FRAGMENT = graphql(`
  fragment SearchUserDetails on SearchUsersDetails {
    id
    profile {
      email
      username
    }
  }
`);

export const SEARCH_USERS = graphql(`
  query SearchUsers($input: SearchQueryInput!) {
    searchUsers(input: $input) {
      teachers {
        ...SearchUserDetails
      }
      students {
        ...SearchUserDetails
      }
    }
  }
`);
