import { createFileRoute } from "@tanstack/react-router";
import { HelpSupportPage } from "~/features/help-support";
import { createPageMeta } from "~/seo";

export const Route = createFileRoute("/(public)/_public/support/")({
  component: HelpSupportPage,
  head: () =>
    createPageMeta({
      title: "Support | WageMore",
      description:
        "Get help and support for using WageMore's prediction markets",
      keywords: "help, support, FAQ, WageMore, prediction markets",
    }),
});
