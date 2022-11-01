import axios from 'axios';
import { Thunder, ZeusScalars } from '@codefarem/generated/orchestrator-graphql';
import { ApplicationConfig } from '../config.server';

/**
 * The graphql requester
 */
export const graphqlSdk = (authorizationToken = '') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authorizationToken)
    headers.Authorization = `Bearer ${authorizationToken}`;
  return Thunder(async (query) => {
    const response = await axios.post(
      `${ApplicationConfig.APPLICATION_API_URL}/graphql`,
      JSON.stringify({ query }),
      { headers }
    );
    if (!response?.data?.data) {
      console.dir(response?.data?.errors, { depth: Infinity })
      throw new Error(`There was an error in the graphql request, please check developer logs`)
    }
    return response.data.data;
  });
};

export const graphqlScalars = ZeusScalars({
  UUID: {
    encode: (e: unknown) => String(`"${e}"`),
    decode: (e: unknown) => e as string,
  },
});
