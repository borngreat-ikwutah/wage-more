import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "~/features/auth/login";

export const Route = createFileRoute("/(public)/(auth)/login/")({
  component: AuthPage,
});
