/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n": types.ExecuteCodeDocument,
    "\n  mutation RegisterUser($input: RegisterUserInput!) {\n    registerUser(input: $input) {\n      __typename\n      ... on RegisterUserOutput {\n        id\n      }\n      ... on RegisterUserError {\n        usernameNotUnique\n        emailNotUnique\n      }\n    }\n  }\n": types.RegisterUserDocument,
    "\n  mutation CreateClass($input: CreateClassInput!) {\n    createClass(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on CreateClassOutput {\n        id\n      }\n    }\n  }\n": types.CreateClassDocument,
    "\n  mutation CreateQuestion($input: CreateQuestionInput!) {\n    createQuestion(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on CreateQuestionOutput {\n        slug\n      }\n    }\n  }\n": types.CreateQuestionDocument,
    "\n  query TestCaseUnits {\n    testCaseUnits\n  }\n": types.TestCaseUnitsDocument,
    "\n  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {\n    executeCodeForQuestion(input: $input) {\n      __typename\n      ... on ExecuteCodeForQuestionOutput {\n        numTestCases\n        numTestCasesFailed\n        testCaseStatuses {\n          passed\n          userOutput\n          expectedOutput\n        }\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n": types.ExecuteCodeForQuestionDocument,
    "\n  query SupportedLanguages {\n    supportedLanguages\n  }\n": types.SupportedLanguagesDocument,
    "\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n": types.LanguageExampleDocument,
    "\n  query UserWithEmail($input: UserWithEmailInput!) {\n    userWithEmail(input: $input) {\n      __typename\n      ... on UserWithEmailOutput {\n        __typename\n      }\n      ... on UserWithEmailError {\n        __typename\n      }\n    }\n  }\n": types.UserWithEmailDocument,
    "\n  query LogoutUser {\n    logoutUser\n  }\n": types.LogoutUserDocument,
    "\n  fragment TestCase on TestCaseData {\n    __typename\n    numberCollectionValue\n    stringCollectionValue\n    numberValue\n    stringValue\n    unitType\n  }\n": types.TestCaseFragmentDoc,
    "\n  query QuestionDetails($questionSlug: String!) {\n    questionDetails(questionSlug: $questionSlug) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on QuestionDetailsOutput {\n        name\n        problem\n        renderedProblem\n        numClasses\n        authoredBy {\n          profile {\n            username\n          }\n        }\n        testCases {\n          inputs {\n            data {\n              ...TestCase\n            }\n          }\n          outputs {\n            data {\n              ...TestCase\n            }\n          }\n        }\n      }\n    }\n  }\n": types.QuestionDetailsDocument,
    "\n  query UserDetails {\n    userDetails {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UserDetailsOutput {\n        accountType\n        profile {\n          email\n          username\n        }\n      }\n    }\n  }\n": types.UserDetailsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterUser($input: RegisterUserInput!) {\n    registerUser(input: $input) {\n      __typename\n      ... on RegisterUserOutput {\n        id\n      }\n      ... on RegisterUserError {\n        usernameNotUnique\n        emailNotUnique\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser($input: RegisterUserInput!) {\n    registerUser(input: $input) {\n      __typename\n      ... on RegisterUserOutput {\n        id\n      }\n      ... on RegisterUserError {\n        usernameNotUnique\n        emailNotUnique\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateClass($input: CreateClassInput!) {\n    createClass(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on CreateClassOutput {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateClass($input: CreateClassInput!) {\n    createClass(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on CreateClassOutput {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateQuestion($input: CreateQuestionInput!) {\n    createQuestion(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on CreateQuestionOutput {\n        slug\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateQuestion($input: CreateQuestionInput!) {\n    createQuestion(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on CreateQuestionOutput {\n        slug\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TestCaseUnits {\n    testCaseUnits\n  }\n"): (typeof documents)["\n  query TestCaseUnits {\n    testCaseUnits\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {\n    executeCodeForQuestion(input: $input) {\n      __typename\n      ... on ExecuteCodeForQuestionOutput {\n        numTestCases\n        numTestCasesFailed\n        testCaseStatuses {\n          passed\n          userOutput\n          expectedOutput\n        }\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {\n    executeCodeForQuestion(input: $input) {\n      __typename\n      ... on ExecuteCodeForQuestionOutput {\n        numTestCases\n        numTestCasesFailed\n        testCaseStatuses {\n          passed\n          userOutput\n          expectedOutput\n        }\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SupportedLanguages {\n    supportedLanguages\n  }\n"): (typeof documents)["\n  query SupportedLanguages {\n    supportedLanguages\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n"): (typeof documents)["\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserWithEmail($input: UserWithEmailInput!) {\n    userWithEmail(input: $input) {\n      __typename\n      ... on UserWithEmailOutput {\n        __typename\n      }\n      ... on UserWithEmailError {\n        __typename\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserWithEmail($input: UserWithEmailInput!) {\n    userWithEmail(input: $input) {\n      __typename\n      ... on UserWithEmailOutput {\n        __typename\n      }\n      ... on UserWithEmailError {\n        __typename\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LogoutUser {\n    logoutUser\n  }\n"): (typeof documents)["\n  query LogoutUser {\n    logoutUser\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TestCase on TestCaseData {\n    __typename\n    numberCollectionValue\n    stringCollectionValue\n    numberValue\n    stringValue\n    unitType\n  }\n"): (typeof documents)["\n  fragment TestCase on TestCaseData {\n    __typename\n    numberCollectionValue\n    stringCollectionValue\n    numberValue\n    stringValue\n    unitType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query QuestionDetails($questionSlug: String!) {\n    questionDetails(questionSlug: $questionSlug) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on QuestionDetailsOutput {\n        name\n        problem\n        renderedProblem\n        numClasses\n        authoredBy {\n          profile {\n            username\n          }\n        }\n        testCases {\n          inputs {\n            data {\n              ...TestCase\n            }\n          }\n          outputs {\n            data {\n              ...TestCase\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query QuestionDetails($questionSlug: String!) {\n    questionDetails(questionSlug: $questionSlug) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on QuestionDetailsOutput {\n        name\n        problem\n        renderedProblem\n        numClasses\n        authoredBy {\n          profile {\n            username\n          }\n        }\n        testCases {\n          inputs {\n            data {\n              ...TestCase\n            }\n          }\n          outputs {\n            data {\n              ...TestCase\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserDetails {\n    userDetails {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UserDetailsOutput {\n        accountType\n        profile {\n          email\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserDetails {\n    userDetails {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UserDetailsOutput {\n        accountType\n        profile {\n          email\n          username\n        }\n      }\n    }\n  }\n"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;