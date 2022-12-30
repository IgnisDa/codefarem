/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
   * Strings within GraphQL. UUIDs are used to assign unique identifiers to
   * entities without requiring a central allocating authority.
   *
   * # References
   *
   * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
   * * [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
   */
  UUID: string;
};

/** The types of accounts a user can create */
export enum AccountType {
  Student = 'STUDENT',
  Teacher = 'TEACHER'
}

/** An error type with an attached field to tell what went wrong. */
export type ApiError = {
  /** The error describing what went wrong */
  error: Scalars['String'];
};

/** The result type if details about the class were found successfully */
export type ClassDetailsOutput = {
  /** The name of the class */
  name: Scalars['String'];
};

/** The output object when getting details about a class */
export type ClassDetailsResultUnion = ApiError | ClassDetailsOutput;

export type ClassPartialsDetails = {
  /** The unique identifier of the class */
  id: Scalars['UUID'];
  /** The detailed markdown text explaining the class */
  joinSlug: Scalars['String'];
  /** The name/title of the class */
  name: Scalars['String'];
  /** The number of students for this class */
  numStudents: Scalars['Int'];
  /** The number of teachers for this class */
  numTeachers: Scalars['Int'];
};

export type ClassPartialsDetailsConnection = {
  /** A list of edges. */
  edges: Array<ClassPartialsDetailsEdge>;
  /** A list of nodes. */
  nodes: Array<ClassPartialsDetails>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ClassPartialsDetailsEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: ClassPartialsDetails;
};

/** The arguments for connection connection parameters. */
export type ConnectionArguments = {
  /** The cursor to start from */
  after?: InputMaybe<Scalars['String']>;
  /** The cursor to end at */
  before?: InputMaybe<Scalars['String']>;
  /** The number of items to return from the start */
  first?: InputMaybe<Scalars['Int']>;
  /** The number of items to return from the end */
  last?: InputMaybe<Scalars['Int']>;
};

/** The output object when deleting a class */
export type DeleteClassResultUnion = ApiError | IdObject;

/** The input object used to delete a question */
export type DeleteQuestionInput = {
  /** The unique slug of the question that needs to be deleted */
  questionSlug: Scalars['String'];
};

/** The output object when deleting question */
export type DeleteQuestionResultUnion = ApiError | IdObject;

/** The result type if an error was encountered when executing code */
export type ExecuteCodeError = {
  /** The error that occurred while compiling/executing the submitted code */
  error: Scalars['String'];
  /** The step in which the error the above error occurred */
  step: ExecuteCodeErrorStep;
};

/** The execution step in which an error was encountered */
export enum ExecuteCodeErrorStep {
  CompilationToWasm = 'COMPILATION_TO_WASM',
  WasmExecution = 'WASM_EXECUTION'
}

/** The input object used to execute some code */
export type ExecuteCodeForQuestionInput = {
  /** The code input that needs to be compiled */
  executeInput: ExecuteCodeInput;
  /** The unique ID of the question for which test cases need to be tested */
  questionSlug: Scalars['String'];
};

/** The result type if the code was compiled and executed successfully */
export type ExecuteCodeForQuestionOutput = {
  /** The total number of test cases */
  numTestCases: Scalars['Int'];
  /** The number of test cases that failed */
  numTestCasesFailed: Scalars['Int'];
  /** Data about individual test cases */
  testCaseStatuses: Array<TestCaseResultUnion>;
};

/** The output object when executing code */
export type ExecuteCodeForQuestionResultUnion = ApiError | ExecuteCodeForQuestionOutput;

/** The input object used to execute some code */
export type ExecuteCodeInput = {
  /** The arguments to be passed to the execution engine */
  arguments: Array<InputCaseUnit>;
  /** The code input that needs to be compiled */
  code: Scalars['String'];
  /** The language that needs to be compiled */
  language: SupportedLanguage;
};

/** The result type if the code was compiled and executed successfully */
export type ExecuteCodeOutput = {
  /** The output of the code that was executed */
  output: Scalars['String'];
  /** The time taken for the various steps */
  time: ExecuteCodeTime;
};

/** The output object when executing code */
export type ExecuteCodeResultUnion = ExecuteCodeError | ExecuteCodeOutput;

/** The time taken for the various steps */
export type ExecuteCodeTime = {
  /** The time taken to compile the code to wasm */
  compilation: Scalars['String'];
  /** The time taken to execute the wasm */
  execution: Scalars['String'];
};

/** Used to uniquely identify an output object. Can also be used to query the database. */
export type IdObject = {
  /** The unique identifier of the object */
  id: Scalars['UUID'];
};

export type InputCaseUnit = {
  data: Scalars['String'];
  dataType: TestCaseUnit;
  /** The name of the variable to store it as */
  name: Scalars['String'];
};

/** Used to uniquely identify an input object */
export type InputIdObject = {
  /** The unique identifier of the object */
  id: Scalars['UUID'];
};

/** The GraphQL top-level mutation type */
export type MutationRoot = {
  /** Delete a class */
  deleteClass: DeleteClassResultUnion;
  /** Delete a question */
  deleteQuestion: DeleteQuestionResultUnion;
  /**
   * Takes some code as input and compiles it to wasm before executing it with the
   * supplied argument
   */
  executeCode: ExecuteCodeResultUnion;
  /** Execute an input code for the selected language and question */
  executeCodeForQuestion: ExecuteCodeForQuestionResultUnion;
  /** Create a new user for the service */
  registerUser: RegisterUserResultUnion;
  /** Create a new class or update an existing one */
  upsertClass: UpsertClassResultUnion;
  /** Upsert a question (create if it doesn't exist, update if it does) */
  upsertQuestion: UpsertQuestionResultUnion;
};


/** The GraphQL top-level mutation type */
export type MutationRootDeleteClassArgs = {
  input: InputIdObject;
};


/** The GraphQL top-level mutation type */
export type MutationRootDeleteQuestionArgs = {
  input: DeleteQuestionInput;
};


/** The GraphQL top-level mutation type */
export type MutationRootExecuteCodeArgs = {
  input: ExecuteCodeInput;
};


/** The GraphQL top-level mutation type */
export type MutationRootExecuteCodeForQuestionArgs = {
  input: ExecuteCodeForQuestionInput;
};


/** The GraphQL top-level mutation type */
export type MutationRootRegisterUserArgs = {
  input: RegisterUserInput;
};


/** The GraphQL top-level mutation type */
export type MutationRootUpsertClassArgs = {
  input: UpsertClassInput;
};


/** The GraphQL top-level mutation type */
export type MutationRootUpsertQuestionArgs = {
  input: UpsertQuestionInput;
};

export type OutputCaseUnit = {
  /** The data to store */
  data: Scalars['String'];
  /** The type of data to store this line as */
  dataType: TestCaseUnit;
};

/** Information about pagination in a connection */
export type PageInfo = {
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** The GraphQL top-level query type */
export type QueryRoot = {
  /** Get information about a class */
  classDetails: ClassDetailsResultUnion;
  /** Get a paginated list of classes in the relay connection format. */
  classesConnection: ClassPartialsDetailsConnection;
  /** Get an example code snippet for a particular language */
  languageExample: Scalars['String'];
  /** Get information about a question and the test cases related to it */
  questionDetails: QuestionDetailsResultUnion;
  /**
   * Get a paginated list of questions in the relay connection format. It uses a cursor
   * based pagination.
   */
  questionsConnection: QuestionPartialsDetailsConnection;
  /** Search for questions. If no query is provided, all questions are returned. */
  searchQuestions: SearchQuestionsOutput;
  /**
   * Search for users in the service by username. If not username is provided, all users
   * are returned.
   */
  searchUsers: SearchUsersGroup;
  /** Get a list of all the languages that the service supports. */
  supportedLanguages: Array<SupportedLanguage>;
  /** Get all the types of test case units possible */
  testCaseUnits: Array<TestCaseUnit>;
  /** Endpoint to get all toolchain information */
  toolchainInformation: Array<ToolChainInformation>;
  /** Get information about the current user */
  userDetails: UserDetailsResultUnion;
  /** Check whether a user with the provided email exists in the service */
  userWithEmail: UserWithEmailResultUnion;
};


/** The GraphQL top-level query type */
export type QueryRootClassDetailsArgs = {
  classId: Scalars['UUID'];
};


/** The GraphQL top-level query type */
export type QueryRootClassesConnectionArgs = {
  args: ConnectionArguments;
};


/** The GraphQL top-level query type */
export type QueryRootLanguageExampleArgs = {
  language: SupportedLanguage;
};


/** The GraphQL top-level query type */
export type QueryRootQuestionDetailsArgs = {
  questionSlug: Scalars['String'];
};


/** The GraphQL top-level query type */
export type QueryRootQuestionsConnectionArgs = {
  args: ConnectionArguments;
};


/** The GraphQL top-level query type */
export type QueryRootSearchQuestionsArgs = {
  input: SearchQueryInput;
};


/** The GraphQL top-level query type */
export type QueryRootSearchUsersArgs = {
  input: SearchQueryInput;
};


/** The GraphQL top-level query type */
export type QueryRootUserWithEmailArgs = {
  input: UserWithEmailInput;
};

export type QuestionData = {
  /** The data related to this input */
  normalizedData: Scalars['String'];
  unitType: TestCaseUnit;
};

/** The input object used to get details about a question */
export type QuestionDetailsOutput = {
  /** The name/title of the question */
  name: Scalars['String'];
  /** The detailed markdown text explaining the question */
  problem: Scalars['String'];
  /** All the test cases that are related to this question */
  testCases: Array<QuestionTestCase>;
};

/** The output object when creating a new question */
export type QuestionDetailsResultUnion = ApiError | QuestionDetailsOutput;

export type QuestionPartialsDetails = {
  /** The date-time when this question was created */
  createdTime: Scalars['String'];
  /** The unique identifier of the question */
  id: Scalars['UUID'];
  /** The name/title of the question */
  name: Scalars['String'];
  /** The number of test cases that are related to this question */
  numTestCases: Scalars['Int'];
  /** The detailed markdown text explaining the question */
  slug: Scalars['String'];
};

export type QuestionPartialsDetailsConnection = {
  /** A list of edges. */
  edges: Array<QuestionPartialsDetailsEdge>;
  /** A list of nodes. */
  nodes: Array<QuestionPartialsDetails>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type QuestionPartialsDetailsEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: QuestionPartialsDetails;
};

export type QuestionTestCase = {
  /** The unique ID for this test case */
  id: Scalars['UUID'];
  /** The ordered inputs for this test case */
  inputs: Array<QuestionData>;
  /** The ordered outputs for this test case */
  outputs: Array<QuestionData>;
};

/** The input object used to create a new user */
export type RegisterUserInput = {
  /** The email of the user */
  email: Scalars['String'];
  /** The ID issued by the hanko auth provider */
  hankoId: Scalars['String'];
  /**
   * If this is defined, the account type will be set to the one defined in the invite,
   * otherwise will be a normal student.
   */
  inviteToken?: InputMaybe<Scalars['String']>;
  /** The username of the user */
  username: Scalars['String'];
};

/** The output object when creating a new user */
export type RegisterUserResultUnion = ApiError | IdObject;

/** The input object used to query for some resource */
export type SearchQueryInput = {
  /** The query to search by */
  queryString?: InputMaybe<Scalars['String']>;
};

export type SearchQuestionsOutput = {
  results: Array<QuestionPartialsDetails>;
  total: Scalars['Int'];
};

export type SearchUsersDetails = {
  id: Scalars['UUID'];
  profile: UserProfileInformation;
};

export type SearchUsersGroup = {
  students: Array<SearchUsersDetails>;
  teachers: Array<SearchUsersDetails>;
};

/** All the languages that are supported by the service */
export enum SupportedLanguage {
  C = 'c',
  Cpp = 'cpp',
  Go = 'go',
  Grain = 'grain',
  Python = 'python',
  Ruby = 'ruby',
  Rust = 'rust',
  Swift = 'swift',
  Zig = 'zig'
}

export type TestCase = {
  /** The inputs related to this test case */
  inputs: Array<InputCaseUnit>;
  /** The outputs related to this test case */
  outputs: Array<OutputCaseUnit>;
};

export type TestCaseResultUnion = ExecuteCodeError | TestCaseSuccessStatus;

/**
 * The result type if a test case was executed successfully. Does not imply that the test
 * case passed, just that the code was executed successfully.
 */
export type TestCaseSuccessStatus = {
  /** The diff between the user's output and the expected output */
  diff: Scalars['String'];
  /** The expected output as defined in the test case */
  expectedOutput: Scalars['String'];
  /** Whether the test case passed or not */
  passed: Scalars['Boolean'];
  /** The time taken for the various steps */
  time: ExecuteCodeTime;
  /** The output of the user's code */
  userOutput: Scalars['String'];
};

export enum TestCaseUnit {
  Number = 'NUMBER',
  NumberCollection = 'NUMBER_COLLECTION',
  String = 'STRING',
  StringCollection = 'STRING_COLLECTION'
}

export type ToolChainInformation = {
  languageLogo: Scalars['String'];
  service: SupportedLanguage;
  version: Scalars['String'];
};

/** The input object used to create a new class */
export type UpsertClassInput = {
  /** The ID of the class. If this is present, then the class will be updated. */
  joinSlug?: InputMaybe<Scalars['String']>;
  /** The name of the class */
  name: Scalars['String'];
  /** The students who are in the class */
  studentIds: Array<Scalars['UUID']>;
  /** The teachers who are teaching the class */
  teacherIds: Array<Scalars['UUID']>;
};

/** The output object when creating a new class */
export type UpsertClassResultUnion = ApiError | IdObject;

/** The input object used to upsert a question */
export type UpsertQuestionInput = {
  /** The name/title of the question */
  name: Scalars['String'];
  /** The detailed text explaining the question */
  problem: Scalars['String'];
  /** All the test cases that are related to this question */
  testCases: Array<TestCase>;
  /** The unique slug of the question in case it is being updated */
  updateSlug?: InputMaybe<Scalars['String']>;
};

/** The result type if the question was upsert-ed successfully */
export type UpsertQuestionOutput = {
  /** The ID of the question */
  id: Scalars['UUID'];
  /** The slug of the upsert-ed question */
  slug: Scalars['String'];
};

/** The output object when upsert-ing new question */
export type UpsertQuestionResultUnion = ApiError | UpsertQuestionOutput;

/** The result type if details about the user were found successfully. */
export type UserDetailsOutput = {
  /** The type of account the user has */
  accountType: AccountType;
  /** The unique ID of the user */
  id: Scalars['UUID'];
  /** Profile details about the user */
  profile: UserProfileInformation;
};

/** The output object when creating a new user */
export type UserDetailsResultUnion = ApiError | UserDetailsOutput;

/** The details of a user's profile. */
export type UserProfileInformation = {
  /** The email of the user */
  email: Scalars['String'];
  /** The username of the user */
  username: Scalars['String'];
};

/** The result type if a user with the provided email was not found */
export type UserWithEmailError = {
  /** The error encountered while finding the user */
  error: Scalars['String'];
};

/** The input object used to query for a user */
export type UserWithEmailInput = {
  /** The email of the user */
  email: Scalars['String'];
};

/** The output object when finding a user with the provided email */
export type UserWithEmailResultUnion = IdObject | UserWithEmailError;

export type ExecuteCodeMutationVariables = Exact<{
  input: ExecuteCodeInput;
}>;


export type ExecuteCodeMutation = { executeCode: { __typename: 'ExecuteCodeError', error: string, step: ExecuteCodeErrorStep } | { __typename: 'ExecuteCodeOutput', output: string, time: { compilation: string, execution: string } } };

export type UpsertClassMutationVariables = Exact<{
  input: UpsertClassInput;
}>;


export type UpsertClassMutation = { upsertClass: { __typename: 'ApiError', error: string } | { __typename: 'IdObject', id: string } };

export type UpsertQuestionMutationVariables = Exact<{
  input: UpsertQuestionInput;
}>;


export type UpsertQuestionMutation = { upsertQuestion: { __typename: 'ApiError', error: string } | { __typename: 'UpsertQuestionOutput', slug: string } };

export type TestCaseUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type TestCaseUnitsQuery = { testCaseUnits: Array<TestCaseUnit> };

export type ExecuteCodeForQuestionMutationVariables = Exact<{
  input: ExecuteCodeForQuestionInput;
}>;


export type ExecuteCodeForQuestionMutation = { executeCodeForQuestion: { __typename: 'ApiError', error: string } | { __typename: 'ExecuteCodeForQuestionOutput', numTestCases: number, numTestCasesFailed: number, testCaseStatuses: Array<{ __typename: 'ExecuteCodeError', error: string, step: ExecuteCodeErrorStep } | { __typename: 'TestCaseSuccessStatus', passed: boolean, userOutput: string, expectedOutput: string, diff: string, time: { compilation: string, execution: string } }> } };

export type DeleteQuestionMutationVariables = Exact<{
  input: DeleteQuestionInput;
}>;


export type DeleteQuestionMutation = { deleteQuestion: { __typename: 'ApiError', error: string } | { __typename: 'IdObject', id: string } };

export type DeleteClassMutationVariables = Exact<{
  input: InputIdObject;
}>;


export type DeleteClassMutation = { deleteClass: { __typename: 'ApiError', error: string } | { __typename: 'IdObject', id: string } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { registerUser: { __typename: 'ApiError', error: string } | { __typename: 'IdObject', id: string } };

export type SupportedLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type SupportedLanguagesQuery = { supportedLanguages: Array<SupportedLanguage> };

export type LanguageExampleQueryVariables = Exact<{
  language: SupportedLanguage;
}>;


export type LanguageExampleQuery = { languageExample: string };

export type ToolchainInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type ToolchainInformationQuery = { toolchainInformation: Array<{ service: SupportedLanguage, version: string, languageLogo: string }> };

export type QuestionsQueryVariables = Exact<{
  args: ConnectionArguments;
}>;


export type QuestionsQuery = { questionsConnection: { pageInfo: { hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ cursor: string, node: { createdTime: string, name: string, slug: string, numTestCases: number } }> } };

export type GetPaginatedClassesQueryVariables = Exact<{
  args: ConnectionArguments;
}>;


export type GetPaginatedClassesQuery = { classesConnection: { pageInfo: { hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ cursor: string, node: { name: string, joinSlug: string, id: string, numTeachers: number, numStudents: number } }> } };

export type QuestionDetailsQueryVariables = Exact<{
  questionSlug: Scalars['String'];
}>;


export type QuestionDetailsQuery = { questionDetails: { __typename: 'ApiError', error: string } | { __typename: 'QuestionDetailsOutput', name: string, problem: string, testCases: Array<{ inputs: Array<{ normalizedData: string, unitType: TestCaseUnit }>, outputs: Array<{ normalizedData: string, unitType: TestCaseUnit }> }> } };

export type SearchQuestionsQueryVariables = Exact<{
  input: SearchQueryInput;
}>;


export type SearchQuestionsQuery = { searchQuestions: { total: number, results: Array<{ id: string, name: string, numTestCases: number }> } };

export type UserWithEmailQueryVariables = Exact<{
  input: UserWithEmailInput;
}>;


export type UserWithEmailQuery = { userWithEmail: { __typename: 'IdObject' } | { __typename: 'UserWithEmailError' } };

export type UserDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDetailsQuery = { userDetails: { __typename: 'ApiError', error: string } | { __typename: 'UserDetailsOutput', accountType: AccountType, profile: { email: string, username: string } } };

export type SearchUserDetailsFragment = { id: string, profile: { email: string, username: string } } & { ' $fragmentName'?: 'SearchUserDetailsFragment' };

export type SearchUsersQueryVariables = Exact<{
  input: SearchQueryInput;
}>;


export type SearchUsersQuery = { searchUsers: { teachers: Array<{ ' $fragmentRefs'?: { 'SearchUserDetailsFragment': SearchUserDetailsFragment } }>, students: Array<{ ' $fragmentRefs'?: { 'SearchUserDetailsFragment': SearchUserDetailsFragment } }> } };

export const SearchUserDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchUserDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchUsersDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<SearchUserDetailsFragment, unknown>;
export const ExecuteCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compilation"}},{"kind":"Field","name":{"kind":"Name","value":"execution"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"step"}}]}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeMutation, ExecuteCodeMutationVariables>;
export const UpsertClassDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertClass"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertClassInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertClass"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IdObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpsertClassMutation, UpsertClassMutationVariables>;
export const UpsertQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertQuestionOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<UpsertQuestionMutation, UpsertQuestionMutationVariables>;
export const TestCaseUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestCaseUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testCaseUnits"}}]}}]} as unknown as DocumentNode<TestCaseUnitsQuery, TestCaseUnitsQueryVariables>;
export const ExecuteCodeForQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCodeForQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeForQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCodeForQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeForQuestionOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numTestCases"}},{"kind":"Field","name":{"kind":"Name","value":"numTestCasesFailed"}},{"kind":"Field","name":{"kind":"Name","value":"testCaseStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"step"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TestCaseSuccessStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"userOutput"}},{"kind":"Field","name":{"kind":"Name","value":"expectedOutput"}},{"kind":"Field","name":{"kind":"Name","value":"diff"}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compilation"}},{"kind":"Field","name":{"kind":"Name","value":"execution"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeForQuestionMutation, ExecuteCodeForQuestionMutationVariables>;
export const DeleteQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IdObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const DeleteClassDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteClass"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputIdObject"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteClass"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IdObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteClassMutation, DeleteClassMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IdObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const SupportedLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportedLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportedLanguages"}}]}}]} as unknown as DocumentNode<SupportedLanguagesQuery, SupportedLanguagesQueryVariables>;
export const LanguageExampleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LanguageExample"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SupportedLanguage"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageExample"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]}]}}]} as unknown as DocumentNode<LanguageExampleQuery, LanguageExampleQueryVariables>;
export const ToolchainInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ToolchainInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toolchainInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"languageLogo"}}]}}]}}]} as unknown as DocumentNode<ToolchainInformationQuery, ToolchainInformationQueryVariables>;
export const QuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"questions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionArguments"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionsConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdTime"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"numTestCases"}}]}}]}}]}}]}}]} as unknown as DocumentNode<QuestionsQuery, QuestionsQueryVariables>;
export const GetPaginatedClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaginatedClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionArguments"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classesConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"joinSlug"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"numTeachers"}},{"kind":"Field","name":{"kind":"Name","value":"numStudents"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPaginatedClassesQuery, GetPaginatedClassesQueryVariables>;
export const QuestionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuestionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionDetailsOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"problem"}},{"kind":"Field","name":{"kind":"Name","value":"testCases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"normalizedData"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"normalizedData"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<QuestionDetailsQuery, QuestionDetailsQueryVariables>;
export const SearchQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchQuestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchQuestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numTestCases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<SearchQuestionsQuery, SearchQuestionsQueryVariables>;
export const UserWithEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserWithEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserWithEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userWithEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IdObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserWithEmailError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode<UserWithEmailQuery, UserWithEmailQueryVariables>;
export const UserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserDetailsOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserDetailsQuery, UserDetailsQueryVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teachers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchUserDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchUserDetails"}}]}}]}}]}},...SearchUserDetailsFragmentDoc.definitions]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;