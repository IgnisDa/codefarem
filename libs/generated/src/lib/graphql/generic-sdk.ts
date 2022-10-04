import { DocumentNode } from 'graphql';
import { gql } from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID: string;
};

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
  WasmExecution = 'WASM_EXECUTION',
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

/** The different errors that can occur when logging in to the service */
export enum LoginError {
  /** The credentials did not match */
  CredentialsMismatch = 'CREDENTIALS_MISMATCH',
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
  /** Takes some code as input and compiles it to wasm before executing it */
  executeCode: ExecuteCodeResultUnion;
  /** Create a new user for the service */
  registerUser: RegisterUserResultUnion;
};

/** The GraphQL top-level mutation type */
export type MutationRootExecuteCodeArgs = {
  input: ExecuteCodeInput;
};

/** The GraphQL top-level mutation type */
export type MutationRootRegisterUserArgs = {
  input: RegisterUserInput;
};

/** The GraphQL top-level query type */
export type QueryRoot = {
  __typename?: 'QueryRoot';
  /** Get an example code snippet for a particular language */
  languageExample: Scalars['String'];
  /** Login a user to the service */
  loginUser: LoginUserResultUnion;
  /** Get a list of all the languages that the service supports. */
  supportedLanguages: Array<SupportedLanguage>;
  /** Get information about the current user */
  userDetails: UserDetailsResultUnion;
};

/** The GraphQL top-level query type */
export type QueryRootLanguageExampleArgs = {
  language: SupportedLanguage;
};

/** The GraphQL top-level query type */
export type QueryRootLoginUserArgs = {
  input: LoginUserInput;
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
  Rust = 'rust',
}

/** The result type if an error was encountered when getting details of a user */
export type UserDetailsError = {
  __typename?: 'UserDetailsError';
  /** The error describing what went wrong */
  error: Scalars['String'];
};

/** The result type if details about the user were found successfully */
export type UserDetailsOutput = {
  __typename?: 'UserDetailsOutput';
  /** Profile details about the user */
  profile: UserProfileInformation;
};

/** The output object when creating a new user */
export type UserDetailsResultUnion = UserDetailsError | UserDetailsOutput;

export type UserProfileInformation = {
  __typename?: 'UserProfileInformation';
  /** The email of the user */
  email: Scalars['String'];
  /** The username of the user */
  username: Scalars['String'];
};

export type ExecuteCodeMutationVariables = Exact<{
  input: ExecuteCodeInput;
}>;

export type ExecuteCodeMutation = {
  __typename?: 'MutationRoot';
  executeCode:
    | {
        __typename: 'ExecuteCodeError';
        error: string;
        step: ExecuteCodeErrorStep;
      }
    | { __typename: 'ExecuteCodeOutput'; output: string };
};

export type SupportedLanguagesQueryVariables = Exact<{ [key: string]: never }>;

export type SupportedLanguagesQuery = {
  __typename?: 'QueryRoot';
  supportedLanguages: Array<SupportedLanguage>;
};

export type LanguageExampleQueryVariables = Exact<{
  language: SupportedLanguage;
}>;

export type LanguageExampleQuery = {
  __typename?: 'QueryRoot';
  languageExample: string;
};

export const ExecuteCodeDocument = gql`
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
`;
export const SupportedLanguagesDocument = gql`
  query SupportedLanguages {
    supportedLanguages
  }
`;
export const LanguageExampleDocument = gql`
  query LanguageExample($language: SupportedLanguage!) {
    languageExample(language: $language)
  }
`;
export type Requester<C = {}, E = unknown> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    ExecuteCode(
      variables: ExecuteCodeMutationVariables,
      options?: C
    ): Promise<ExecuteCodeMutation> {
      return requester<ExecuteCodeMutation, ExecuteCodeMutationVariables>(
        ExecuteCodeDocument,
        variables,
        options
      ) as Promise<ExecuteCodeMutation>;
    },
    SupportedLanguages(
      variables?: SupportedLanguagesQueryVariables,
      options?: C
    ): Promise<SupportedLanguagesQuery> {
      return requester<
        SupportedLanguagesQuery,
        SupportedLanguagesQueryVariables
      >(
        SupportedLanguagesDocument,
        variables,
        options
      ) as Promise<SupportedLanguagesQuery>;
    },
    LanguageExample(
      variables: LanguageExampleQueryVariables,
      options?: C
    ): Promise<LanguageExampleQuery> {
      return requester<LanguageExampleQuery, LanguageExampleQueryVariables>(
        LanguageExampleDocument,
        variables,
        options
      ) as Promise<LanguageExampleQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
