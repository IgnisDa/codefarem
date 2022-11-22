import { Selector } from '@codefarem/generated/orchestrator-graphql';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { graphqlSdk } from '~/lib/services/graphql.server';

import type { LoaderArgs } from '@remix-run/server-runtime';

const testCaseData = Selector('TestCaseData')({
  numberCollectionValue: true,
  stringCollectionValue: true,
  numberValue: true,
  stringValue: true,
  unitType: true,
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
  return json({ questionDetails });
};

export default () => {
  const { questionDetails } = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(questionDetails, null, 4)}</pre>;
};
