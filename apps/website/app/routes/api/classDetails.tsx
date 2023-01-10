import { CLASS_DETAILS } from ':graphql/orchestrator/queries';
import { json, LoaderArgs } from '@remix-run/server-runtime';
import { badRequest } from 'remix-utils';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';

const actionSchema = z.object({ joinSlug: z.string() });

export const loader = async ({ request }: LoaderArgs) => {
  const { joinSlug } = zx.parseQuery(request, actionSchema);
  const { classDetails } = await gqlClient.request(CLASS_DETAILS, { joinSlug });
  if (classDetails.__typename === 'ApiError')
    throw badRequest({ message: classDetails.error });
  return json({ classDetails });
};
