import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { serverEnv } from "~/config/env";
import { db } from "~/db/client";
import * as schema from "~/db/schema/auth";

export const auth = betterAuth({
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [tanstackStartCookies()],
});
