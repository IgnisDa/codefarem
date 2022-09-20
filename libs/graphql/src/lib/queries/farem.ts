import { gql } from 'urql';

export const SUPPORTED_LANGUAGES = gql`
  query SupportedLanguages {
    supportedLanguages
  }
`;
