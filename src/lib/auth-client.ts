import { createAuthClient } from "better-auth/react";
import { clientEnv } from "~/config/client-env";

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_APP_URL,
});
