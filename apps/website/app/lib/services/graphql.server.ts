import type { GraphQLResponse } from ':generated/graphql/orchestrator';
import {
  GraphQLError,
  Thunder,
  ZeusScalars,
} from ':generated/graphql/orchestrator';
import { ApplicationConfig } from '../config.server';

const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json();
};

/**
 * The graphql requester
 */
export const graphqlSdk = (authorizationToken = '') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    connection: 'keep-alive',
  };
  if (authorizationToken)
    headers.Authorization = `Bearer ${authorizationToken}`;
  return Thunder(async (query) => {
    return fetch(`${ApplicationConfig.APPLICATION_API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) throw new GraphQLError(response);
        return response.data;
      });
  });
};

export const graphqlScalars = ZeusScalars({
  UUID: {
    encode: (e: unknown) => String(`"${e}"`),
    decode: (e: unknown) => e as string,
  },
});
