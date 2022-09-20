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

export type QueryRoot = {
  __typename?: 'QueryRoot';
  supportedLanguages: Array<SupportedLanguage>;
};

export enum SupportedLanguage {
  Rust = 'RUST',
}

export type SupportedLanguagesQueryVariables = Exact<{ [key: string]: never }>;

export type SupportedLanguagesQuery = {
  __typename?: 'QueryRoot';
  supportedLanguages: Array<SupportedLanguage>;
};

export const SupportedLanguagesDocument = gql`
  query SupportedLanguages {
    supportedLanguages
  }
`;
export type Requester<C = {}, E = unknown> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
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
  };
}
export type Sdk = ReturnType<typeof getSdk>;
