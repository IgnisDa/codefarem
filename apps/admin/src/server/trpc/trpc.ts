import superjson from "superjson";
import { initTRPC } from "@trpc/server";
import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
  transformer: superjson,
});

export const { router } = t;

export const publicProcedure = t.procedure;
