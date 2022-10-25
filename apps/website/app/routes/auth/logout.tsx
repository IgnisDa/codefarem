import { FAILURE_REDIRECT_PATH, LOGOUT_PATH } from '../../lib/constants';
import { authenticator } from '../../lib/services/auth.server';

import type { DataFunctionArgs } from '@remix-run/node';
import { graphqlSdk } from '../../lib/services/graphql.server';

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
  await graphqlSdk(user.token)('query')({
    logoutUser: true,
  });
  await authenticator.logout(request, {
    redirectTo: LOGOUT_PATH,
  });
};
