import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "~/features/auth/onboarding";

export const Route = createFileRoute("/(public)/(auth)/onboarding/")({
  component: OnboardingPage,
});
