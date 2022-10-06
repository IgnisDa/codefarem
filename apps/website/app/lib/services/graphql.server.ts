import { getSdk } from '@codefarem/generated/graphql/generic-sdk';
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
} from 'urql';
import { createUrqlRequester } from 'urql-generic-requester';

import { ApplicationConfig } from '../config.server';

const client = createClient({
  url: `${ApplicationConfig.APPLICATION_API_URL}/graphql`,
  exchanges: [dedupExchange, cacheExchange, fetchExchange],
});

const requestHandler = createUrqlRequester(client);

// FIXME: Incompatible types
export const graphqlSdk = getSdk(requestHandler as any);

export const getFetchOptions = (
  token: string
): { fetchOptions: RequestInit } => ({
  fetchOptions: { headers: { Authorization: `Bearer ${token}` } },
});
