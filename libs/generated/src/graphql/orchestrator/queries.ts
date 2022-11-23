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

export const LOGOUT_USER = graphql(`
  query LogoutUser {
    logoutUser
  }
`);

export const TEST_CASE_DATA_FRAGMENT = graphql(`
  fragment TestCase on TestCaseData {
    __typename
    numberCollectionValue
    stringCollectionValue
    numberValue
    stringValue
    unitType
  }
`);

export const QUESTION_DETAILS = graphql(`
  query QuestionDetails($questionSlug: String!) {
    questionDetails(questionSlug: $questionSlug) {
      __typename
      ... on ApiError {
        error
      }
      ... on QuestionDetailsOutput {
        name
        problem
        renderedProblem
        numClasses
        authoredBy {
          profile {
            username
          }
        }
        testCases {
          inputs {
            name
            data {
              ...TestCase
            }
          }
          outputs {
            data {
              ...TestCase
            }
          }
        }
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
