import { createRouter, ErrorComponent } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { NotFoundPage } from "./features/not-found-page";
import { DefaultErrorPage } from "./features/error-page";
import { getContext, InnerProviders } from "~/providers/root-provider";

export function getRouter() {
  const context = getContext();

  const router = createRouter({
    routeTree,
    context: { ...context },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ({ error }) => <DefaultErrorPage error={error} />,
    InnerWrap: ({ children }) => {
      return (
        <InnerProviders queryClient={context.queryClient}>
          {children}
        </InnerProviders>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: context.queryClient,
  });

  return router;
}
