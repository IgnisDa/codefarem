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
};

/** The GraphQL top-level mutation type */
export type MutationRoot = {
  __typename?: 'MutationRoot';
  /** Compile a rust source and execute it. */
  compileRust: Scalars['String'];
};

/** The GraphQL top-level mutation type */
export type MutationRootCompileRustArgs = {
  input: Scalars['String'];
};

/** The GraphQL top-level query type */
export type QueryRoot = {
  __typename?: 'QueryRoot';
  /** Get an example code snippet for a particular language */
  languageExample: Scalars['String'];
  /** Get a list of all the languages that the service supports. */
  supportedLanguages: Array<SupportedLanguage>;
};

/** The GraphQL top-level query type */
export type QueryRootLanguageExampleArgs = {
  language: SupportedLanguage;
};

export enum SupportedLanguage {
  Rust = 'RUST',
}

export type CompileRustMutationVariables = Exact<{
  input: Scalars['String'];
}>;

export type CompileRustMutation = {
  __typename?: 'MutationRoot';
  compileRust: string;
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

export const CompileRustDocument = gql`
  mutation CompileRust($input: String!) {
    compileRust(input: $input)
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
    CompileRust(
      variables: CompileRustMutationVariables,
      options?: C
    ): Promise<CompileRustMutation> {
      return requester<CompileRustMutation, CompileRustMutationVariables>(
        CompileRustDocument,
        variables,
        options
      ) as Promise<CompileRustMutation>;
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
