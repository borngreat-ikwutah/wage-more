import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "~/features/auth/login";
import { createPageMeta } from "~/seo";
import { requireUnAuth } from "~/server/auth";

export const Route = createFileRoute("/(public)/(auth)/login/")({
  beforeLoad: () => requireUnAuth(),
  component: AuthPage,
  head: () =>
    createPageMeta({
      title: "Authentication - WageMore",
      description:
        "Sign in or create an account to access WageMore's prediction markets",
      keywords: "login, signup, authentication, WageMore, prediction markets",
    }),
});
