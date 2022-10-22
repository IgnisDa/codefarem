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

/** The types of accounts a user can create */
export enum AccountType {
  Student = 'STUDENT',
  Teacher = 'TEACHER',
}

/** An error type with an attached field to tell what went wrong */
export type ApiError = {
  __typename?: 'ApiError';
  /** The error describing what went wrong */
  error: Scalars['String'];
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
  /** Create a new class */
  createClass: CreateClassResultUnion;
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
  /** Get information about a class */
  classDetails: ClassDetailsResultUnion;
  /** Get an example code snippet for a particular language */
  languageExample: Scalars['String'];
  /** Login a user to the service */
  loginUser: LoginUserResultUnion;
  /** Logout a user from the service */
  logoutUser: Scalars['Boolean'];
  /** Get a list of all the languages that the service supports. */
  supportedLanguages: Array<SupportedLanguage>;
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
export type QueryRootUserWithEmailArgs = {
  input: UserWithEmailInput;
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
  Rust = 'rust',
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

export type CreateClassMutationVariables = Exact<{
  input: CreateClassInput;
}>;

export type CreateClassMutation = {
  __typename?: 'MutationRoot';
  createClass:
    | { __typename: 'ApiError'; error: string }
    | { __typename: 'CreateClassOutput'; id: string };
};

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;

export type RegisterUserMutation = {
  __typename?: 'MutationRoot';
  registerUser:
    | {
        __typename: 'RegisterUserError';
        usernameNotUnique: boolean;
        emailNotUnique: boolean;
      }
    | { __typename: 'RegisterUserOutput'; id: string };
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

export type LoginUserQueryVariables = Exact<{
  input: LoginUserInput;
}>;

export type LoginUserQuery = {
  __typename?: 'QueryRoot';
  loginUser:
    | { __typename: 'LoginUserError'; error: LoginError }
    | { __typename: 'LoginUserOutput'; token: string };
};

export type UserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type UserDetailsQuery = {
  __typename?: 'QueryRoot';
  userDetails:
    | { __typename: 'ApiError'; error: string }
    | {
        __typename: 'UserDetailsOutput';
        accountType: AccountType;
        profile: {
          __typename?: 'UserProfileInformation';
          email: string;
          username: string;
        };
      };
};

export type LogoutUserQueryVariables = Exact<{ [key: string]: never }>;

export type LogoutUserQuery = { __typename?: 'QueryRoot'; logoutUser: boolean };

export type UserWithEmailQueryVariables = Exact<{
  input: UserWithEmailInput;
}>;

export type UserWithEmailQuery = {
  __typename?: 'QueryRoot';
  userWithEmail:
    | { __typename: 'UserWithEmailError'; error: string }
    | { __typename: 'UserWithEmailOutput'; id: string };
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
export const CreateClassDocument = gql`
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      __typename
      ... on CreateClassOutput {
        id
      }
      ... on ApiError {
        error
      }
    }
  }
`;
export const RegisterUserDocument = gql`
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
export const LoginUserDocument = gql`
  query LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      __typename
      ... on LoginUserOutput {
        token
      }
      ... on LoginUserError {
        error
      }
    }
  }
`;
export const UserDetailsDocument = gql`
  query UserDetails {
    userDetails {
      __typename
      ... on UserDetailsOutput {
        accountType
        profile {
          email
          username
        }
      }
      ... on ApiError {
        error
      }
    }
  }
`;
export const LogoutUserDocument = gql`
  query LogoutUser {
    logoutUser
  }
`;
export const UserWithEmailDocument = gql`
  query UserWithEmail($input: UserWithEmailInput!) {
    userWithEmail(input: $input) {
      __typename
      ... on UserWithEmailOutput {
        id
      }
      ... on UserWithEmailError {
        error
      }
    }
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
    CreateClass(
      variables: CreateClassMutationVariables,
      options?: C
    ): Promise<CreateClassMutation> {
      return requester<CreateClassMutation, CreateClassMutationVariables>(
        CreateClassDocument,
        variables,
        options
      ) as Promise<CreateClassMutation>;
    },
    RegisterUser(
      variables: RegisterUserMutationVariables,
      options?: C
    ): Promise<RegisterUserMutation> {
      return requester<RegisterUserMutation, RegisterUserMutationVariables>(
        RegisterUserDocument,
        variables,
        options
      ) as Promise<RegisterUserMutation>;
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
    LoginUser(
      variables: LoginUserQueryVariables,
      options?: C
    ): Promise<LoginUserQuery> {
      return requester<LoginUserQuery, LoginUserQueryVariables>(
        LoginUserDocument,
        variables,
        options
      ) as Promise<LoginUserQuery>;
    },
    UserDetails(
      variables?: UserDetailsQueryVariables,
      options?: C
    ): Promise<UserDetailsQuery> {
      return requester<UserDetailsQuery, UserDetailsQueryVariables>(
        UserDetailsDocument,
        variables,
        options
      ) as Promise<UserDetailsQuery>;
    },
    LogoutUser(
      variables?: LogoutUserQueryVariables,
      options?: C
    ): Promise<LogoutUserQuery> {
      return requester<LogoutUserQuery, LogoutUserQueryVariables>(
        LogoutUserDocument,
        variables,
        options
      ) as Promise<LogoutUserQuery>;
    },
    UserWithEmail(
      variables: UserWithEmailQueryVariables,
      options?: C
    ): Promise<UserWithEmailQuery> {
      return requester<UserWithEmailQuery, UserWithEmailQueryVariables>(
        UserWithEmailDocument,
        variables,
        options
      ) as Promise<UserWithEmailQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
