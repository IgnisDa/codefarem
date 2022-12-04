import e from ':main-db';
import * as edgedb from 'edgedb';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(async ({ input }) => {
      const client = edgedb.createClient()
      const g = await e
        .select(e.organizations.Organization)
        .run(client)
      return { greeting: `Hello ${input?.text ?? "world"}`, }
    }),
});
