import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import { db } from "~/db/client";
import { user } from "~/db/schema";

export const requireUnAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();

    const session = await auth.api.getSession({
      headers: headers,
    });

    if (session?.user) {
      throw redirect({
        to: "/dashboard/home",
      });
    }
  },
);

export const requireAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();

    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session?.user) {
      throw redirect({
        to: "/login",
      });
    }

    return session;
  },
);

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();

    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session?.user) {
      return null;
    }

    // Get full user data from database
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    return userData;
  },
);

export const checkOnboardingStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();

    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session?.user) {
      return { isCompleted: false, needsAuth: true };
    }

    // Get user onboarding status from database
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        onboardingCompleted: true,
        id: true,
        name: true,
      },
    });

    if (!userData) {
      return { isCompleted: false, needsAuth: true };
    }

    return {
      isCompleted: userData.onboardingCompleted,
      needsAuth: false,
      userId: userData.id,
      username: userData.name,
    };
  },
);
