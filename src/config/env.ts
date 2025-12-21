import * as z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
});

export const serverEnv = envSchema.parse(process.env);
