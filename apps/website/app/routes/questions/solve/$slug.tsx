import { Selector } from '@codefarem/generated/orchestrator-graphql';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { graphqlSdk } from '~/lib/services/graphql.server';

import type { LoaderArgs } from '@remix-run/server-runtime';
import { notFound } from 'remix-utils';

const testCaseData = Selector('TestCaseData')({
  numberCollectionValue: true,
  stringCollectionValue: true,
  numberValue: true,
  stringValue: true,
  unitType: true,
});

export const meta = ({ data }: { data: { title: string } }) => ({
  title: data.title,
});

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug;
  invariant(typeof slug === 'string', 'Slug should be a string');
  const { questionDetails } = await graphqlSdk()('query')({
    questionDetails: [
      { questionSlug: slug },
      {
        __typename: true,
        '...on ApiError': { error: true },
        '...on QuestionDetailsOutput': {
          name: true,
          problem: true,
          numClasses: true,
          authoredBy: { profile: { username: true } },
          testCases: {
            inputs: {
              name: true,
              data: testCaseData,
            },
            outputs: {
              data: testCaseData,
            },
          },
        },
      },
    ],
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
