import {
  Thunder,
  ZeusScalars,
} from '@codefarem/generated/orchestrator-graphql';
import { ApplicationConfig } from '../config.server';

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
    const response = await fetch(
      `${ApplicationConfig.APPLICATION_API_URL}/graphql`,
      { method: 'POST', body: JSON.stringify({ query }), headers }
    );
    const data = await response.json();
    return data.data;
  });
};

export const graphqlScalars = ZeusScalars({
  UUID: {
    encode: (e: unknown) => String(`"${e}"`),
    decode: (e: unknown) => e as string,
  },
});
