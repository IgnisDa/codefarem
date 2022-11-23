import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';

import type { LoaderArgs } from '@remix-run/server-runtime';
import { notFound } from 'remix-utils';
import { gqlClient } from '~/lib/services/graphql.server';
import { QUESTION_DETAILS } from ':generated/graphql/orchestrator/queries';

export const meta = ({ data }: { data: { title: string } }) => ({
  title: data.title,
});

export const loader = async ({ params }: LoaderArgs) => {
  const questionSlug = params.slug;
  invariant(typeof questionSlug === 'string', 'Slug should be a string');
  const { questionDetails } = await gqlClient.request(QUESTION_DETAILS, {
    questionSlug,
  });
  if (questionDetails.__typename === 'ApiError')
    throw notFound({ title: 'Not found' });
  const title = questionDetails.name;
  return json({ questionDetails, title });
};

export default () => {
  const { questionDetails } = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(questionDetails, null, 4)}</pre>;
};
