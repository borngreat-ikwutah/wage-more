import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import { serverEnv } from "~/config/env";

dotenv.config();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
