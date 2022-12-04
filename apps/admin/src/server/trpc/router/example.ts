import e from ':main-db';
import { z } from 'zod';
import { edgedb } from '../../db/client'

import { publicProcedure, router } from '../trpc';

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(async ({ input }) => {
      const g = await e
        .select(e.organizations.Organization)
        .run(edgedb)
      console.log(g);
      return { greeting: `Hello ${input?.text ?? "world"}`, }
    }),
});
