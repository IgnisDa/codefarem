import { graphql } from ':generated/graphql/orchestrator';

export const UPSERT_CLASS = graphql(`
  mutation UpsertClass($input: UpsertClassInput!) {
    upsertClass(input: $input) {
      __typename
      ... on ApiError {
        error
      }
      ... on UpsertClassOutput {
        id
      }
    }
  }
`);

export const UPSERT_QUESTION = graphql(`
  mutation UpsertQuestion($input: UpsertQuestionInput!) {
    upsertQuestion(input: $input) {
      __typename
      ... on ApiError {
        error
      }
      ... on UpsertQuestionOutput {
        slug
      }
    }
  }
`);

export const TEST_CASE_UNITS = graphql(`
  query TestCaseUnits {
    testCaseUnits
  }
`);

export const EXECUTE_CODE_FOR_QUESTION = graphql(`
  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {
    executeCodeForQuestion(input: $input) {
      __typename
      ... on ExecuteCodeForQuestionOutput {
        numTestCases
        numTestCasesFailed
        testCaseStatuses {
          __typename
          ... on ExecuteCodeError {
            error
            step
          }
          ... on TestCaseSuccessStatus {
            passed
            userOutput
            expectedOutput
            diff
            time {
              compilation
              execution
            }
          }
        }
      }
      ... on ApiError {
        error
      }
    }
  }
`);

export const DELETE_QUESTION = graphql(`
  mutation DeleteQuestion($input: DeleteQuestionInput!) {
    deleteQuestion(input: $input) {
      __typename
      ... on DeleteQuestionOutput {
        id
      }
      ... on ApiError {
        error
      }
    }
  }
`);
