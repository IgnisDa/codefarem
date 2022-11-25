import { graphql } from './generated';

export const EXECUTE_CODE = graphql(`
  mutation ExecuteCode($input: ExecuteCodeInput!) {
    executeCode(input: $input) {
      __typename
      ... on ExecuteCodeOutput {
        output
      }
      ... on ExecuteCodeError {
        error
        step
      }
    }
  }
`);

export const REGISTER_USER = graphql(`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      __typename
      ... on RegisterUserOutput {
        id
      }
      ... on RegisterUserError {
        usernameNotUnique
        emailNotUnique
      }
    }
  }
`);

export const CREATE_CLASS = graphql(`
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      __typename
      ... on ApiError {
        error
      }
      ... on CreateClassOutput {
        id
      }
    }
  }
`);

export const CREATE_QUESTION = graphql(`
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      __typename
      ... on ApiError {
        error
      }
      ... on CreateQuestionOutput {
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
          passed
          userOutput
          expectedOutput
        }
      }
      ... on ExecuteCodeError {
        error
        step
      }
    }
  }
`);
