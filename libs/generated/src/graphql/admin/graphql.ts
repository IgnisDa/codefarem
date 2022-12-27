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

export type CreateInviteLinkInput = {
  /** The type of account to create */
  accountType: AccountType;
  /** The email address of the user to invite */
  email?: InputMaybe<Scalars['String']>;
  /** The time for which the invite link is valid */
  validFor: Scalars['String'];
};

/** The result type if the invite link was created successfully */
export type CreateInviteLinkOutput = {
  /** The unique token associated with the invite link */
  token: Scalars['String'];
};

/** The output object when creating a new class */
export type CreateInviteLinkResultUnion = ApiError | CreateInviteLinkOutput;

export type InviteLinkDto = {
  email?: Maybe<Scalars['String']>;
  expiresAt: Scalars['String'];
  id: Scalars['String'];
  isActive: Scalars['Boolean'];
  role: AccountType;
  token: Scalars['String'];
  usedAt?: Maybe<Scalars['String']>;
};

export type MutationRoot = {
  createInviteLink: CreateInviteLinkResultUnion;
};


export type MutationRootCreateInviteLinkArgs = {
  input: CreateInviteLinkInput;
};

export type QueryRoot = {
  allInviteLinks: Array<InviteLinkDto>;
};

export type CreateInviteLinkMutationVariables = Exact<{
  input: CreateInviteLinkInput;
}>;


export type CreateInviteLinkMutation = { createInviteLink: { __typename: 'ApiError', error: string } | { __typename: 'CreateInviteLinkOutput', token: string } };

export type AllInviteLinksQueryVariables = Exact<{ [key: string]: never; }>;


export type AllInviteLinksQuery = { allInviteLinks: Array<{ id: string, token: string, isActive: boolean, email?: string | null, expiresAt: string, usedAt?: string | null, role: AccountType }> };


export const CreateInviteLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInviteLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInviteLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInviteLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInviteLinkOutput"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode<CreateInviteLinkMutation, CreateInviteLinkMutationVariables>;
export const AllInviteLinksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllInviteLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allInviteLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"usedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<AllInviteLinksQuery, AllInviteLinksQueryVariables>;