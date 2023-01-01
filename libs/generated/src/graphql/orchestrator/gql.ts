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
    "\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n        time {\n          compilation\n          execution\n        }\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n": types.ExecuteCodeDocument,
    "\n  mutation UpsertClass($input: UpsertClassInput!) {\n    upsertClass(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on IdObject {\n        id\n      }\n    }\n  }\n": types.UpsertClassDocument,
    "\n  mutation UpsertQuestion($input: UpsertQuestionInput!) {\n    upsertQuestion(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UpsertQuestionOutput {\n        slug\n      }\n    }\n  }\n": types.UpsertQuestionDocument,
    "\n  query TestCaseUnits {\n    testCaseUnits\n  }\n": types.TestCaseUnitsDocument,
    "\n  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {\n    executeCodeForQuestion(input: $input) {\n      __typename\n      ... on ExecuteCodeForQuestionOutput {\n        numTestCases\n        numTestCasesFailed\n        testCaseStatuses {\n          __typename\n          ... on ExecuteCodeError {\n            error\n            step\n          }\n          ... on TestCaseSuccessStatus {\n            passed\n            userOutput\n            expectedOutput\n            diff\n            time {\n              compilation\n              execution\n            }\n          }\n        }\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n": types.ExecuteCodeForQuestionDocument,
    "\n  mutation DeleteQuestion($input: DeleteQuestionInput!) {\n    deleteQuestion(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n": types.DeleteQuestionDocument,
    "\n  mutation DeleteClass($input: InputIdObject!) {\n    deleteClass(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n": types.DeleteClassDocument,
    "\n  mutation RegisterUser($input: RegisterUserInput!) {\n    registerUser(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n": types.RegisterUserDocument,
    "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n": types.UpdateUserDocument,
    "\n  query SupportedLanguages {\n    supportedLanguages\n  }\n": types.SupportedLanguagesDocument,
    "\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n": types.LanguageExampleDocument,
    "\n  query ToolchainInformation {\n    toolchainInformation {\n      service\n      version\n      languageLogo\n    }\n  }\n": types.ToolchainInformationDocument,
    "\n  query questions($args: ConnectionArguments!) {\n    questionsConnection(args: $args) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          createdTime\n          name\n          slug\n          numTestCases\n        }\n      }\n    }\n  }\n": types.QuestionsDocument,
    "\n  query GetPaginatedClasses($args: ConnectionArguments!) {\n    classesConnection(args: $args) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          name\n          joinSlug\n          id\n          numTeachers\n          numStudents\n        }\n      }\n    }\n  }\n": types.GetPaginatedClassesDocument,
    "\n  query QuestionDetails($questionSlug: String!) {\n    questionDetails(questionSlug: $questionSlug) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on QuestionDetailsOutput {\n        name\n        problem\n        testCases {\n          inputs {\n            normalizedData\n            unitType\n          }\n          outputs {\n            normalizedData\n            unitType\n          }\n        }\n      }\n    }\n  }\n": types.QuestionDetailsDocument,
    "\n  query SearchQuestions($input: SearchQueryInput!) {\n    searchQuestions(input: $input) {\n      results {\n        id\n        name\n        numTestCases\n      }\n      total\n    }\n  }\n": types.SearchQuestionsDocument,
    "\n  query UserWithEmail($input: UserWithEmailInput!) {\n    userWithEmail(input: $input) {\n      __typename\n      ... on IdObject {\n        __typename\n      }\n      ... on UserWithEmailError {\n        __typename\n      }\n    }\n  }\n": types.UserWithEmailDocument,
    "\n  query UserDetails {\n    userDetails {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UserDetailsOutput {\n        accountType\n        profile {\n          email\n          username\n          profileAvatar\n        }\n      }\n    }\n  }\n": types.UserDetailsDocument,
    "\n  fragment SearchUserDetails on SearchUsersDetails {\n    id\n    profile {\n      email\n      username\n    }\n  }\n": types.SearchUserDetailsFragmentDoc,
    "\n  query SearchUsers($input: SearchQueryInput!) {\n    searchUsers(input: $input) {\n      teachers {\n        ...SearchUserDetails\n      }\n      students {\n        ...SearchUserDetails\n      }\n    }\n  }\n": types.SearchUsersDocument,
    "\n  query RandomProfileAvatar {\n    randomProfileAvatar\n  }\n": types.RandomProfileAvatarDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n        time {\n          compilation\n          execution\n        }\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n        time {\n          compilation\n          execution\n        }\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpsertClass($input: UpsertClassInput!) {\n    upsertClass(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on IdObject {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpsertClass($input: UpsertClassInput!) {\n    upsertClass(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on IdObject {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpsertQuestion($input: UpsertQuestionInput!) {\n    upsertQuestion(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UpsertQuestionOutput {\n        slug\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpsertQuestion($input: UpsertQuestionInput!) {\n    upsertQuestion(input: $input) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UpsertQuestionOutput {\n        slug\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TestCaseUnits {\n    testCaseUnits\n  }\n"): (typeof documents)["\n  query TestCaseUnits {\n    testCaseUnits\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {\n    executeCodeForQuestion(input: $input) {\n      __typename\n      ... on ExecuteCodeForQuestionOutput {\n        numTestCases\n        numTestCasesFailed\n        testCaseStatuses {\n          __typename\n          ... on ExecuteCodeError {\n            error\n            step\n          }\n          ... on TestCaseSuccessStatus {\n            passed\n            userOutput\n            expectedOutput\n            diff\n            time {\n              compilation\n              execution\n            }\n          }\n        }\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ExecuteCodeForQuestion($input: ExecuteCodeForQuestionInput!) {\n    executeCodeForQuestion(input: $input) {\n      __typename\n      ... on ExecuteCodeForQuestionOutput {\n        numTestCases\n        numTestCasesFailed\n        testCaseStatuses {\n          __typename\n          ... on ExecuteCodeError {\n            error\n            step\n          }\n          ... on TestCaseSuccessStatus {\n            passed\n            userOutput\n            expectedOutput\n            diff\n            time {\n              compilation\n              execution\n            }\n          }\n        }\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteQuestion($input: DeleteQuestionInput!) {\n    deleteQuestion(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteQuestion($input: DeleteQuestionInput!) {\n    deleteQuestion(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteClass($input: InputIdObject!) {\n    deleteClass(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteClass($input: InputIdObject!) {\n    deleteClass(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterUser($input: RegisterUserInput!) {\n    registerUser(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser($input: RegisterUserInput!) {\n    registerUser(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      __typename\n      ... on IdObject {\n        id\n      }\n      ... on ApiError {\n        error\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query ToolchainInformation {\n    toolchainInformation {\n      service\n      version\n      languageLogo\n    }\n  }\n"): (typeof documents)["\n  query ToolchainInformation {\n    toolchainInformation {\n      service\n      version\n      languageLogo\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query questions($args: ConnectionArguments!) {\n    questionsConnection(args: $args) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          createdTime\n          name\n          slug\n          numTestCases\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query questions($args: ConnectionArguments!) {\n    questionsConnection(args: $args) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          createdTime\n          name\n          slug\n          numTestCases\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPaginatedClasses($args: ConnectionArguments!) {\n    classesConnection(args: $args) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          name\n          joinSlug\n          id\n          numTeachers\n          numStudents\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPaginatedClasses($args: ConnectionArguments!) {\n    classesConnection(args: $args) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          name\n          joinSlug\n          id\n          numTeachers\n          numStudents\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query QuestionDetails($questionSlug: String!) {\n    questionDetails(questionSlug: $questionSlug) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on QuestionDetailsOutput {\n        name\n        problem\n        testCases {\n          inputs {\n            normalizedData\n            unitType\n          }\n          outputs {\n            normalizedData\n            unitType\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query QuestionDetails($questionSlug: String!) {\n    questionDetails(questionSlug: $questionSlug) {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on QuestionDetailsOutput {\n        name\n        problem\n        testCases {\n          inputs {\n            normalizedData\n            unitType\n          }\n          outputs {\n            normalizedData\n            unitType\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchQuestions($input: SearchQueryInput!) {\n    searchQuestions(input: $input) {\n      results {\n        id\n        name\n        numTestCases\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query SearchQuestions($input: SearchQueryInput!) {\n    searchQuestions(input: $input) {\n      results {\n        id\n        name\n        numTestCases\n      }\n      total\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserWithEmail($input: UserWithEmailInput!) {\n    userWithEmail(input: $input) {\n      __typename\n      ... on IdObject {\n        __typename\n      }\n      ... on UserWithEmailError {\n        __typename\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserWithEmail($input: UserWithEmailInput!) {\n    userWithEmail(input: $input) {\n      __typename\n      ... on IdObject {\n        __typename\n      }\n      ... on UserWithEmailError {\n        __typename\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserDetails {\n    userDetails {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UserDetailsOutput {\n        accountType\n        profile {\n          email\n          username\n          profileAvatar\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserDetails {\n    userDetails {\n      __typename\n      ... on ApiError {\n        error\n      }\n      ... on UserDetailsOutput {\n        accountType\n        profile {\n          email\n          username\n          profileAvatar\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SearchUserDetails on SearchUsersDetails {\n    id\n    profile {\n      email\n      username\n    }\n  }\n"): (typeof documents)["\n  fragment SearchUserDetails on SearchUsersDetails {\n    id\n    profile {\n      email\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchUsers($input: SearchQueryInput!) {\n    searchUsers(input: $input) {\n      teachers {\n        ...SearchUserDetails\n      }\n      students {\n        ...SearchUserDetails\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchUsers($input: SearchQueryInput!) {\n    searchUsers(input: $input) {\n      teachers {\n        ...SearchUserDetails\n      }\n      students {\n        ...SearchUserDetails\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RandomProfileAvatar {\n    randomProfileAvatar\n  }\n"): (typeof documents)["\n  query RandomProfileAvatar {\n    randomProfileAvatar\n  }\n"];

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