import { GraphQLClient } from 'graphql-request';
import { ApplicationConfig } from '../config.server';

export const gqlClient = new GraphQLClient(
  `${ApplicationConfig.APPLICATION_API_URL}/graphql`
);

export const getAuthHeader = (token: string) => ({
  authorization: `Bearer ${token}`,
});
