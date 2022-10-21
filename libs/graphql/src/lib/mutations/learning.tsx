import { gql } from 'urql';

export const CREATE_CLASS = gql`
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      __typename
      ... on CreateClassOutput {
        id
      }
      ... on ApiError {
        error
      }
    }
  }
`;
