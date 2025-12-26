import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "~/features/auth/login";
import { requireUnAuth } from "~/server/auth";

export const Route = createFileRoute("/(public)/(auth)/login/")({
  beforeLoad: () => requireUnAuth(),
  component: AuthPage,
});
