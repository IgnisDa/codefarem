import { FAILURE_REDIRECT_PATH, LOGOUT_PATH } from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';

import type { DataFunctionArgs } from '@remix-run/node';
import { getAuthHeader, gqlClient } from '~/lib/services/graphql.server';
import { LOGOUT_USER } from ':generated/graphql/orchestrator/queries';

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
  await gqlClient.request(LOGOUT_USER, undefined, getAuthHeader(user.token));
  await authenticator.logout(request, { redirectTo: LOGOUT_PATH });
};
