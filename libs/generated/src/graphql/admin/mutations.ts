import { graphql } from './generated';

export const CREATE_INVITE_LINK = graphql(`
    mutation CreateInviteLink($input: CreateInviteLinkInput!) {
      createInviteLink(input: $input) {
        __typename
        ...on CreateInviteLinkOutput {
          token
        }
        ...on ApiError {
          error
        }
      }
    }
`)
