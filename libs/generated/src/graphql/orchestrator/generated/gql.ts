/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n": types.ExecuteCodeDocument,
    "\n  query LoginUser($input: LoginUserInput!) {\n    loginUser(input: $input) {\n      __typename\n      ... on LoginUserOutput {\n        token\n      }\n      ... on LoginUserError {\n        error\n      }\n    }\n  }\n": types.LoginUserDocument,
    "\n  query SupportedLanguages {\n    supportedLanguages\n  }\n": types.SupportedLanguagesDocument,
    "\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n": types.LanguageExampleDocument,
};

export function graphql(source: "\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ExecuteCode($input: ExecuteCodeInput!) {\n    executeCode(input: $input) {\n      __typename\n      ... on ExecuteCodeOutput {\n        output\n      }\n      ... on ExecuteCodeError {\n        error\n        step\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query LoginUser($input: LoginUserInput!) {\n    loginUser(input: $input) {\n      __typename\n      ... on LoginUserOutput {\n        token\n      }\n      ... on LoginUserError {\n        error\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoginUser($input: LoginUserInput!) {\n    loginUser(input: $input) {\n      __typename\n      ... on LoginUserOutput {\n        token\n      }\n      ... on LoginUserError {\n        error\n      }\n    }\n  }\n"];
export function graphql(source: "\n  query SupportedLanguages {\n    supportedLanguages\n  }\n"): (typeof documents)["\n  query SupportedLanguages {\n    supportedLanguages\n  }\n"];
export function graphql(source: "\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n"): (typeof documents)["\n  query LanguageExample($language: SupportedLanguage!) {\n    languageExample(language: $language)\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;