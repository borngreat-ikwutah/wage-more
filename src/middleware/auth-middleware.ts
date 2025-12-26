import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "~/db/client";
import { auth } from "~/lib/auth";
import { user } from "~/db/schema";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      throw redirect({ to: "/login" });
    }

    // Check onboarding status
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        onboardingCompleted: true,
        id: true,
      },
    });

    if (!userData?.onboardingCompleted) {
      throw redirect({ to: "/onboarding" });
    }

    return await next();
  },
);
