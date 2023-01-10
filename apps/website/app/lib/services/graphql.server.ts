import { parse } from 'cookie';
import { GraphQLClient } from 'graphql-request';
import { ApplicationConfig } from '../config.server';

export const gqlClient = new GraphQLClient(
  `${ApplicationConfig.APPLICATION_API_URL}/graphql`,
  { headers: { connection: 'keep-alive' } }
);

const getAuthHeader = (token: string) => ({
  authorization: `Bearer ${token}`
});

export const extractHankoCookie = (request: Request) => {
  const cookies = parse(request.headers.get('Cookie') || '');
  return cookies.hanko;
};

export const authenticatedRequest = (request: Request) =>
  getAuthHeader(extractHankoCookie(request));
