import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "~/features/auth/onboarding";
import { createPageMeta } from "~/seo";

export const Route = createFileRoute("/(public)/(auth)/onboarding/")({
  component: OnboardingPage,
  head: () =>
    createPageMeta({
      title: "Get Started - WageMore",
      description: "Complete your account setup and start trading on WageMore",
      keywords: "onboarding, setup, WageMore, new user",
    }),
});
