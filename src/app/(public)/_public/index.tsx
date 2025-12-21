// src/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "~/components/ui/button";
import { ThemeSwitcher } from "~/components/shared";
import { AppPage } from "~/features/home";

export const Route = createFileRoute("/(public)/_public/")({
  component: AppPage,
});
