import { graphql } from ':generated/graphql/orchestrator';

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

export const SEARCH_QUESTIONS = graphql(`
  query SearchQuestions($input: SearchQueryInput!) {
    searchQuestions(input: $input) {
      results {
        id
        name
        numTestCases
      }
      total
    }
  }
`);
