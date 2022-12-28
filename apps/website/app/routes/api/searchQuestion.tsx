import type { LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { z } from 'zod';
import { zx } from 'zodix';

const searchSchema = z.object({
  search: z.string().min(1),
});

export const loader = async ({ request }: LoaderArgs) => {
  const { search } = zx.parseQuery(request, searchSchema);
  return json({ search });
};

export type SearchLoader = typeof loader;
