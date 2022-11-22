import { graphql } from './generated';

export const LOGIN_USER = graphql(`
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
`);

export const SUPPORTED_LANGUAGES = graphql(`
  query SupportedLanguages {
    supportedLanguages
  }
`);

export const LANGUAGE_EXAMPLE = graphql(`
  query LanguageExample($language: SupportedLanguage!) {
    languageExample(language: $language)
  }
`);
