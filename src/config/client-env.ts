import * as z from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z.string(),
  VITE_APP_URL: z.string(),
});

export const clientEnv = envSchema.parse(import.meta.env);
