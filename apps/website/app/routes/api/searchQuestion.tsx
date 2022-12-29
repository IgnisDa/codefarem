import { SEARCH_QUESTIONS } from ':graphql/orchestrator/queries';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';

const searchSchema = z.object({
  search: z.string().min(1),
});

export const loader = async ({ request }: LoaderArgs) => {
  const { search } = zx.parseQuery(request, searchSchema);
  const { searchQuestions } = await gqlClient.request(SEARCH_QUESTIONS, {
    input: { queryString: search },
  });
  const data = searchQuestions.results.map((s) => ({
    value: s.id,
    label: s.name,
    numTestCases: s.numTestCases,
  }));
  return json({ data });
};

export type SearchLoader = typeof loader;
