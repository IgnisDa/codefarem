import { graphql } from './generated';

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
        testCases {
          inputs {
            normalizedData
            unitType
          }
          outputs {
            normalizedData
            unitType
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

export const QUESTIONS_CONNECTION = graphql(`
  query questions($args: ConnectionArguments!) {
    questionsConnection(args: $args) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          createdTime
          name
          slug
          numTestCases
        }
      }
    }
  }
`);

export const CLASSES_CONNECTION = graphql(`
  query GetPaginatedClasses($args: ConnectionArguments!) {
    classesConnection(args: $args) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          name
          joinSlug
          id
          numTeachers
          numStudents
        }
      }
    }
  }
`)

export const TOOLCHAIN_INFORMATION = graphql(`
  query ToolchainInformation {
    toolchainInformation {
      service
      version
      languageLogo
    }
  }
`);
