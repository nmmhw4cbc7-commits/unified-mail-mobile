import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createOAuthRequest, providerIsConfigured } from "./mail-providers";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  mail: router({
    accounts: publicProcedure.input(z.object({ deviceId: z.string().min(16) })).query(async ({ input }) => { const user = await db.getUserByOpenId(`device:${input.deviceId}`); return user ? db.listMailAccounts(user.id) : []; }),
    providers: publicProcedure.query(() => ({ gmail: providerIsConfigured("gmail"), outlook: providerIsConfigured("outlook") })),
    oauthStart: publicProcedure.input(z.object({ provider: z.enum(["gmail", "outlook"]), deviceId: z.string().min(16) })).mutation(async ({ ctx, input }) => { const openId = `device:${input.deviceId}`; await db.upsertUser({ openId, loginMethod: "device" }); const user = await db.getUserByOpenId(openId); if (!user) throw new Error("Device identity could not be created"); return createOAuthRequest(input.provider, ctx.req, user.id); }),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
