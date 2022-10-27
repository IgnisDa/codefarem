import axios from 'axios';
import { Thunder, ZeusScalars } from '@codefarem/generated/graphql/zeus';

import { ApplicationConfig } from '../config.server';

/**
 * The graphql requester
 */
export const graphqlSdk = (authorizationToken = '') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authorizationToken)
    headers['Authorization'] = `Bearer ${authorizationToken}`;
  return Thunder(async (query) => {
    const response = await axios.post(
      `${ApplicationConfig.APPLICATION_API_URL}/graphql`,
      JSON.stringify({ query }),
      { headers }
    );
    return response.data.data;
  });
};

export const graphqlScalars = ZeusScalars({
  UUID: {
    encode: (e: unknown) => e as string,
    decode: (e: unknown) => e as string,
  },
});
