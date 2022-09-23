import { gql } from 'urql';

export const SUPPORTED_LANGUAGES = gql`
  query SupportedLanguages {
    supportedLanguages
  }
`;

export const LANGUAGE_EXAMPLE = gql`
  query LanguageExample($language: SupportedLanguage!) {
    languageExample(language: $language)
  }
`;
