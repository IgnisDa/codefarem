import { FAILURE_REDIRECT_PATH } from '~/lib/constants';
import { redirect } from '@remix-run/node';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { LOGOUT_USER } from ':generated/graphql/orchestrator/queries';

export const loader = async ({ request }: DataFunctionArgs) => {
  await gqlClient.request(
    LOGOUT_USER,
    undefined,
    authenticatedRequest(request)
  );
  return redirect(FAILURE_REDIRECT_PATH);
};
