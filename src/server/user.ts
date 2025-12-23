import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();

    try {
      // Get session from request headers
      const session = await auth.api.getSession({
        headers: headers,
      });

      if (!session) {
        return { user: null, authenticated: false };
      }

      // Return user data from session
      return {
        user: session.user,
        authenticated: true,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null, authenticated: false };
    }
  },
);
