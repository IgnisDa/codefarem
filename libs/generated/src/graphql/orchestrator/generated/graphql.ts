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

/** An error type with an attached field to tell what went wrong */
export type ApiError = {
  __typename?: 'ApiError';
  /** The error describing what went wrong */
  error: Scalars['String'];
};

export type AuthoredByInformation = {
  __typename?: 'AuthoredByInformation';
  profile: AuthoredByProfile;
};

export type AuthoredByProfile = {
  __typename?: 'AuthoredByProfile';
  username: Scalars['String'];
};

/** The result type if details about the class were found successfully */
export type ClassDetailsOutput = {
  __typename?: 'ClassDetailsOutput';
  /** The name of the class */
  name: Scalars['String'];
};

/** The output object when getting details about a class */
export type ClassDetailsResultUnion = ApiError | ClassDetailsOutput;

/** The input object used to create a new class */
export type CreateClassInput = {
  /** The name of the class */
  name: Scalars['String'];
  /** The teachers who are teaching the class */
  teacherIds: Array<Scalars['UUID']>;
};

/** The result type if the class was created successfully */
export type CreateClassOutput = {
  __typename?: 'CreateClassOutput';
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
  __typename?: 'CreateQuestionOutput';
  /** The ID of the question */
  id: Scalars['UUID'];
  /** The slug of the newly created question */
  slug: Scalars['String'];
};

/** The output object when creating a new question */
export type CreateQuestionResultUnion = ApiError | CreateQuestionOutput;

/** The result type if an error was encountered when executing code */
export type ExecuteCodeError = {
  __typename?: 'ExecuteCodeError';
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
export type ExecuteCodeInput = {
  /** The code input that needs to be compiled */
  code: Scalars['String'];
  /** The language that needs to be compiled */
  language: SupportedLanguage;
};

/** The result type if the code was compiled and executed successfully */
export type ExecuteCodeOutput = {
  __typename?: 'ExecuteCodeOutput';
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

/** The different errors that can occur when logging in to the service */
export enum LoginError {
  /** The credentials did not match */
  CredentialsMismatch = 'CREDENTIALS_MISMATCH'
}

/** The result type if an error was encountered when creating a new user */
export type LoginUserError = {
  __typename?: 'LoginUserError';
  /** The error encountered while logging in */
  error: LoginError;
};

/** The input object used to create a new user */
export type LoginUserInput = {
  /** The email of the user */
  email: Scalars['String'];
  /** The password that the user wants to set */
  password: Scalars['String'];
};

/** The result type if the user was created successfully */
export type LoginUserOutput = {
  __typename?: 'LoginUserOutput';
  /** The unique JWT token to be issued */
  token: Scalars['String'];
};

/** The output object when creating a new user */
export type LoginUserResultUnion = LoginUserError | LoginUserOutput;

/** The GraphQL top-level mutation type */
export type MutationRoot = {
  __typename?: 'MutationRoot';
  /** Create a new class */
  createClass: CreateClassResultUnion;
  /** Create a new question */
  createQuestion: CreateQuestionResultUnion;
  /** Takes some code as input and compiles it to wasm before executing it */
  executeCode: ExecuteCodeResultUnion;
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
export type MutationRootRegisterUserArgs = {
  input: RegisterUserInput;
};

export type OutputCaseUnit = {
  /** The data to store */
  data: Scalars['String'];
  /** The type of data to store this line as */
  dataType: TestCaseUnit;
};

/** The GraphQL top-level query type */
export type QueryRoot = {
  __typename?: 'QueryRoot';
  /** Get information about a class */
  classDetails: ClassDetailsResultUnion;
  /** Get an example code snippet for a particular language */
  languageExample: Scalars['String'];
  /** Login a user to the service */
  loginUser: LoginUserResultUnion;
  /** Logout a user from the service */
  logoutUser: Scalars['Boolean'];
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
export type QueryRootClassDetailsArgs = {
  classId: Scalars['UUID'];
};


/** The GraphQL top-level query type */
export type QueryRootLanguageExampleArgs = {
  language: SupportedLanguage;
};


/** The GraphQL top-level query type */
export type QueryRootLoginUserArgs = {
  input: LoginUserInput;
};


/** The GraphQL top-level query type */
export type QueryRootQuestionDetailsArgs = {
  questionSlug: Scalars['String'];
};


/** The GraphQL top-level query type */
export type QueryRootUserWithEmailArgs = {
  input: UserWithEmailInput;
};

/** The input object used to get details about a question */
export type QuestionDetailsOutput = {
  __typename?: 'QuestionDetailsOutput';
  /** The users who have created/edited this question */
  authoredBy: Array<AuthoredByInformation>;
  /** The name/title of the question */
  name: Scalars['String'];
  /** The number of classes that have this question */
  numClasses: Scalars['Int'];
  /** The detailed text explaining the question */
  problem: Scalars['String'];
  /** All the test cases that are related to this question */
  testCases: Array<QuestionTestCase>;
};

/** The output object when creating a new question */
export type QuestionDetailsResultUnion = ApiError | QuestionDetailsOutput;

export type QuestionInput = {
  __typename?: 'QuestionInput';
  /** The data related to this input */
  data: TestCaseData;
  /** The name of the variable */
  name: Scalars['String'];
};

export type QuestionOutput = {
  __typename?: 'QuestionOutput';
  /** The data related to this output */
  data: TestCaseData;
};

export type QuestionTestCase = {
  __typename?: 'QuestionTestCase';
  /** The unique ID for this test case */
  id: Scalars['UUID'];
  /** The ordered inputs for this test case */
  inputs: Array<QuestionInput>;
  /** The ordered outputs for this test case */
  outputs: Array<QuestionOutput>;
};

/** The result type if an error was encountered when creating a new user */
export type RegisterUserError = {
  __typename?: 'RegisterUserError';
  /** whether the provided email is unique */
  emailNotUnique: Scalars['Boolean'];
  /** whether the provided username is unique */
  usernameNotUnique: Scalars['Boolean'];
};

/** The input object used to create a new user */
export type RegisterUserInput = {
  /** The type of account the user wants to create */
  accountType: AccountType;
  /** The email of the user */
  email: Scalars['String'];
  /** The password that the user wants to set */
  password: Scalars['String'];
  /** The username of the user */
  username: Scalars['String'];
};

/** The result type if the user was created successfully */
export type RegisterUserOutput = {
  __typename?: 'RegisterUserOutput';
  /** The ID of the user */
  id: Scalars['UUID'];
};

/** The output object when creating a new user */
export type RegisterUserResultUnion = RegisterUserError | RegisterUserOutput;

export enum SupportedLanguage {
  Cpp = 'cpp',
  Go = 'go',
  Rust = 'rust'
}

export type TestCase = {
  /** The inputs related to this test case */
  inputs: Array<InputCaseUnit>;
  /** The outputs related to this test case */
  outputs: Array<OutputCaseUnit>;
};

export type TestCaseData = {
  __typename?: 'TestCaseData';
  numberCollectionValue?: Maybe<Array<Scalars['Float']>>;
  numberValue?: Maybe<Scalars['Float']>;
  stringCollectionValue?: Maybe<Array<Scalars['String']>>;
  stringValue?: Maybe<Scalars['String']>;
  unitType: TestCaseUnit;
};

export enum TestCaseUnit {
  Number = 'NUMBER',
  NumberCollection = 'NUMBER_COLLECTION',
  String = 'STRING',
  StringCollection = 'STRING_COLLECTION'
}

/** The result type if details about the user were found successfully */
export type UserDetailsOutput = {
  __typename?: 'UserDetailsOutput';
  /** The type of account the user has */
  accountType: AccountType;
  /** Profile details about the user */
  profile: UserProfileInformation;
};

/** The output object when creating a new user */
export type UserDetailsResultUnion = ApiError | UserDetailsOutput;

export type UserProfileInformation = {
  __typename?: 'UserProfileInformation';
  /** The email of the user */
  email: Scalars['String'];
  /** The username of the user */
  username: Scalars['String'];
};

/** The result type if a user with the provided email was not found */
export type UserWithEmailError = {
  __typename?: 'UserWithEmailError';
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
  __typename?: 'UserWithEmailOutput';
  /** The unique ID of the user */
  id: Scalars['UUID'];
};

/** The output object when finding a user with the provided email */
export type UserWithEmailResultUnion = UserWithEmailError | UserWithEmailOutput;

export type ExecuteCodeMutationVariables = Exact<{
  input: ExecuteCodeInput;
}>;


export type ExecuteCodeMutation = { __typename?: 'MutationRoot', executeCode: { __typename: 'ExecuteCodeError', error: string, step: ExecuteCodeErrorStep } | { __typename: 'ExecuteCodeOutput', output: string } };

export type LoginUserQueryVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginUserQuery = { __typename?: 'QueryRoot', loginUser: { __typename: 'LoginUserError', error: LoginError } | { __typename: 'LoginUserOutput', token: string } };

export type SupportedLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type SupportedLanguagesQuery = { __typename?: 'QueryRoot', supportedLanguages: Array<SupportedLanguage> };

export type LanguageExampleQueryVariables = Exact<{
  language: SupportedLanguage;
}>;


export type LanguageExampleQuery = { __typename?: 'QueryRoot', languageExample: string };


export const ExecuteCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"output"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteCodeError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"step"}}]}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeMutation, ExecuteCodeMutationVariables>;
export const LoginUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUserOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUserError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<LoginUserQuery, LoginUserQueryVariables>;
export const SupportedLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportedLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportedLanguages"}}]}}]} as unknown as DocumentNode<SupportedLanguagesQuery, SupportedLanguagesQueryVariables>;
export const LanguageExampleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LanguageExample"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SupportedLanguage"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageExample"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]}]}}]} as unknown as DocumentNode<LanguageExampleQuery, LanguageExampleQueryVariables>;