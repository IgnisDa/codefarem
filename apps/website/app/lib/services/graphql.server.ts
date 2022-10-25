import axios from 'axios';
import { Chain, Thunder } from '@codefarem/generated/graphql/zeus';

import { ApplicationConfig } from '../config.server';

/**
 * The graphql requester
 */
export const graphqlSdk = (token = '') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token !== '') headers['Authorization'] = `Bearer ${token}`;
  return Thunder(async (query) => {
    const response = await axios.post(
      `${ApplicationConfig.APPLICATION_API_URL}/graphql`,
      JSON.stringify({ query }),
      { headers }
    );
    return response.data.data;
  });
};
