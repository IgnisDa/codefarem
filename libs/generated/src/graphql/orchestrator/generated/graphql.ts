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

export type AuthoredByInformation = {
  profile: AuthoredByProfile;
};

export type AuthoredByProfile = {
  username: Scalars['String'];
};

/** The result type if details about the class were found successfully */
export type ClassDetailsOutput = {
  /** The name of the class */
  name: Scalars['String'];
};

/** The output object when getting details about a class */
export type ClassDetailsResultUnion = ApiError | ClassDetailsOutput;

/** The arguments for connection connection parameters. */
export type ConnectionArguments = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** The input object used to create a new class */
export type CreateClassInput = {
  /** The name of the class */
  name: Scalars['String'];
  /** The teachers who are teaching the class */
  teacherIds: Array<Scalars['UUID']>;
};

/** The result type if the class was created successfully */
export type CreateClassOutput = {
  /** The ID of the class */
  id: Scalars['UUID'];
};

/** The output object when creating a new class */
export type CreateClassResultUnion = ApiError | CreateClassOutput;

/** The input object used to create a new question */
export type CreateQuestionInput = {
  /** The classes in which the question must be asked */
  classIds: Array<Scalars['UUID']>;
  /** The name/title of the question */
  name: Scalars['String'];
  /** The detailed text explaining the question */
  problem: Scalars['String'];
  /** All the test cases that are related to this question */
  testCases: Array<TestCase>;
};

/** The result type if the question was created successfully */
export type CreateQuestionOutput = {
  /** The ID of the question */
  id: Scalars['UUID'];
  /** The slug of the newly created question */
  slug: Scalars['String'];
};

/** The output object when creating a new question */
export type CreateQuestionResultUnion = ApiError | CreateQuestionOutput;

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
  testCaseStatuses: Array<TestCaseStatus>;
};

/** The output object when executing code */
export type ExecuteCodeForQuestionResultUnion = ExecuteCodeError | ExecuteCodeForQuestionOutput;

/** The input object used to execute some code */
export type ExecuteCodeInput = {
  /** The arguments to be passed to the execution engine */
  arguments: Array<Scalars['String']>;
  /** The code input that needs to be compiled */
  code: Scalars['String'];
  /** The language that needs to be compiled */
  language: SupportedLanguage;
};

/** The result type if the code was compiled and executed successfully */
export type ExecuteCodeOutput = {
  /** The output of the code that was executed */
  output: Scalars['String'];
};

/** The output object when executing code */
export type ExecuteCodeResultUnion = ExecuteCodeError | ExecuteCodeOutput;

export type InputCaseUnit = {
  data: Scalars['String'];
  dataType: TestCaseUnit;
  /** The name of the variable to store it as */
  name: Scalars['String'];
};

/** The GraphQL top-level mutation type */
export type MutationRoot = {
  /** Create a new class */
  createClass: CreateClassResultUnion;
  /** Create a new question */
  createQuestion: CreateQuestionResultUnion;
  /**
   * Takes some code as input and compiles it to wasm before executing it with the
   * supplied argument
   */
  executeCode: ExecuteCodeResultUnion;
  /** Execute an input code for the selected language and question */
  executeCodeForQuestion: ExecuteCodeForQuestionResultUnion;
  /** Create a new user for the service */
  registerUser: RegisterUserResultUnion;
};


/** The GraphQL top-level mutation type */
export type MutationRootCreateClassArgs = {
  input: CreateClassInput;
};


/** The GraphQL top-level mutation type */
export type MutationRootCreateQuestionArgs = {
  input: CreateQuestionInput;
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
  /** Get all the questions */
  allQuestions: QuestionPartialsDetailsConnection;
  /** Get information about a class */
  classDetails: ClassDetailsResultUnion;
  /** Get an example code snippet for a particular language */
  languageExample: Scalars['String'];
  /** Get information about a question and the test cases related to it */
  questionDetails: QuestionDetailsResultUnion;
  /** Get a list of all the languages that the service supports. */
  supportedLanguages: Array<SupportedLanguage>;
  /** Get all the types of test case units possible */
  testCaseUnits: Array<TestCaseUnit>;
  /** Get information about the current user */
  userDetails: UserDetailsResultUnion;
  /** Check whether a user with the provided email exists in the service */
  userWithEmail: UserWithEmailResultUnion;
};


/** The GraphQL top-level query type */
export type QueryRootAllQuestionsArgs = {
  args: ConnectionArguments;
};


/** The GraphQL top-level query type */
export type QueryRootClassDetailsArgs = {
  classId: Scalars['UUID'];
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
export type QueryRootUserWithEmailArgs = {
  input: UserWithEmailInput;
};

export type QuestionData = {
  /** The data related to this input */
  data: TestCaseData;
};

/** The input object used to get details about a question */
export type QuestionDetailsOutput = {
  /** The users who have created/edited this question */
  authoredBy: Array<AuthoredByInformation>;
  /** The name/title of the question */
  name: Scalars['String'];
  /** The number of classes that have this question */
  numClasses: Scalars['Int'];
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

/** The result type if the user was created successfully */
export type RegisterUserOutput = {
  /** The ID of the user */
  id: Scalars['UUID'];
};

/** The output object when creating a new user */
export type RegisterUserResultUnion = ApiError | RegisterUserOutput;

/** All the languages that are supported by the service */
export enum SupportedLanguage {
  C = 'c',
  Cpp = 'cpp',
  Go = 'go',
  Python = 'python',
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

export type TestCaseData = {
  numberCollectionValue?: Maybe<Array<Scalars['Float']>>;
  numberValue?: Maybe<Scalars['Float']>;
  stringCollectionValue?: Maybe<Array<Scalars['String']>>;
  stringValue?: Maybe<Scalars['String']>;
  unitType: TestCaseUnit;
};

export type TestCaseStatus = {
  /** The expected output as defined in the test case */
  expectedOutput: Scalars['String'];
  /** Whether the test case passed or not */
  passed: Scalars['Boolean'];
  /** The output of the user's code */
  userOutput: Scalars['String'];
};

export enum TestCaseUnit {
  Number = 'NUMBER',
  NumberCollection = 'NUMBER_COLLECTION',
  String = 'STRING',
  StringCollection = 'STRING_COLLECTION'
}

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

/** The result type if the user was created successfully */
export type UserWithEmailOutput = {
  /** The unique ID of the user */
  id: Scalars['UUID'];
};

/** The output object when finding a user with the provided email */
export type UserWithEmailResultUnion = UserWithEmailError | UserWithEmailOutput;

export type ExecuteCodeMutationVariables = Exact<{
  input: ExecuteCodeInput;
}>;


export type ExecuteCodeMutation = { executeCode: { __typename: 'ExecuteCodeError', error: string, step: ExecuteCodeErrorStep } | { __typename: 'ExecuteCodeOutput', output: string } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { registerUser: { __typename: 'ApiError', error: string } | { __typename: 'RegisterUserOutput', id: string } };

export type CreateClassMutationVariables = Exact<{
  input: CreateClassInput;
}>;


export type CreateClassMutation = { createClass: { __typename: 'ApiError', error: string } | { __typename: 'CreateClassOutput', id: string } };

export type CreateQuestionMutationVariables = Exact<{
  input: CreateQuestionInput;
}>;


export type CreateQuestionMutation = { createQuestion: { __typename: 'ApiError', error: string } | { __typename: 'CreateQuestionOutput', slug: string } };

export type TestCaseUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type TestCaseUnitsQuery = { testCaseUnits: Array<TestCaseUnit> };

export type ExecuteCodeForQuestionMutationVariables = Exact<{
  input: ExecuteCodeForQuestionInput;
}>;


export type ExecuteCodeForQuestionMutation = { executeCodeForQuestion: { __typename: 'ExecuteCodeError', error: string, step: ExecuteCodeErrorStep } | { __typename: 'ExecuteCodeForQuestionOutput', numTestCases: number, numTestCasesFailed: number, testCaseStatuses: Array<{ passed: boolean, userOutput: string, expectedOutput: string }> } };

export type SupportedLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type SupportedLanguagesQuery = { supportedLanguages: Array<SupportedLanguage> };

export type LanguageExampleQueryVariables = Exact<{
  language: SupportedLanguage;
}>;


export type LanguageExampleQuery = { languageExample: string };

export type UserWithEmailQueryVariables = Exact<{
  input: UserWithEmailInput;
}>;


export type UserWithEmailQuery = { userWithEmail: { __typename: 'UserWithEmailError' } | { __typename: 'UserWithEmailOutput' } };

export type TestCaseFragment = { __typename: 'TestCaseData', numberCollectionValue?: Array<number> | null, stringCollectionValue?: Array<string> | null, numberValue?: number | null, stringValue?: string | null, unitType: TestCaseUnit } & { ' $fragmentName'?: 'TestCaseFragment' };

export type QuestionDetailsQueryVariables = Exact<{
  questionSlug: Scalars['String'];
}>;


export type QuestionDetailsQuery = { questionDetails: { __typename: 'ApiError', error: string } | { __typename: 'QuestionDetailsOutput', name: string, problem: string, numClasses: number, authoredBy: Array<{ profile: { username: string } }>, testCases: Array<{ inputs: Array<{ data: { ' $fragmentRefs'?: { 'TestCaseFragment': TestCaseFragment } } }>, outputs: Array<{ data: { ' $fragmentRefs'?: { 'TestCaseFragment': TestCaseFragment } } }> }> } };

export type UserDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDetailsQuery = { userDetails: { __typename: 'ApiError', error: string } | { __typename: 'UserDetailsOutput', accountType: AccountType, profile: { email: string, username: string } } };

export type AllQuestionsQueryVariables = Exact<{
  args: ConnectionArguments;
}>;


export type AllQuestionsQuery = { allQuestions: { pageInfo: { hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ cursor: string, node: { createdTime: string, name: string, slug: string, numTestCases: number } }> } };

export const TestCaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestCase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TestCaseData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"numberCollectionValue"}},{"kind":"Field","name":{"kind":"Name","value":"stringCollectionValue"}},{"kind":"Field","name":{"kind":"Name","value":"numberValue"}},{"kind":"Field","name":{"kind":"Name","value":"stringValue"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}}]} as unknown as DocumentNode<TestCaseFragment, unknown>;
export const ExecuteCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"output"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"step"}}]}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeMutation, ExecuteCodeMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const CreateClassDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateClass"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateClassInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createClass"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateClassOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateClassMutation, CreateClassMutationVariables>;
export const CreateQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuestionOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<CreateQuestionMutation, CreateQuestionMutationVariables>;
export const TestCaseUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestCaseUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testCaseUnits"}}]}}]} as unknown as DocumentNode<TestCaseUnitsQuery, TestCaseUnitsQueryVariables>;
export const ExecuteCodeForQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCodeForQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeForQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCodeForQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeForQuestionOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numTestCases"}},{"kind":"Field","name":{"kind":"Name","value":"numTestCasesFailed"}},{"kind":"Field","name":{"kind":"Name","value":"testCaseStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"userOutput"}},{"kind":"Field","name":{"kind":"Name","value":"expectedOutput"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"step"}}]}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeForQuestionMutation, ExecuteCodeForQuestionMutationVariables>;
export const SupportedLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportedLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportedLanguages"}}]}}]} as unknown as DocumentNode<SupportedLanguagesQuery, SupportedLanguagesQueryVariables>;
export const LanguageExampleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LanguageExample"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SupportedLanguage"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageExample"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]}]}}]} as unknown as DocumentNode<LanguageExampleQuery, LanguageExampleQueryVariables>;
export const UserWithEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserWithEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserWithEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userWithEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserWithEmailOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserWithEmailError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode<UserWithEmailQuery, UserWithEmailQueryVariables>;
export const QuestionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuestionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionDetailsOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"problem"}},{"kind":"Field","name":{"kind":"Name","value":"numClasses"}},{"kind":"Field","name":{"kind":"Name","value":"authoredBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"testCases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestCase"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestCase"}}]}}]}}]}}]}}]}}]}},...TestCaseFragmentDoc.definitions]} as unknown as DocumentNode<QuestionDetailsQuery, QuestionDetailsQueryVariables>;
export const UserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserDetailsOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserDetailsQuery, UserDetailsQueryVariables>;
export const AllQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllQuestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionArguments"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allQuestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdTime"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"numTestCases"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllQuestionsQuery, AllQuestionsQueryVariables>;