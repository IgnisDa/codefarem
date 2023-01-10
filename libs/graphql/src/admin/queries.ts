import { graphql } from ':generated/graphql/admin';

export const CREATE_INVITE_LINK = graphql(`
  mutation CreateInviteLink($input: CreateInviteLinkInput!) {
    createInviteLink(input: $input) {
      __typename
      ... on CreateInviteLinkOutput {
        token
      }
      ... on ApiError {
        error
      }
    }
  }
`);

export const ALL_INVITE_LINKS = graphql(`
  query AllInviteLinks {
    allInviteLinks {
      id
      token
      isActive
      email
      expiresAt
      usedAt
      role
    }
  }
`);
