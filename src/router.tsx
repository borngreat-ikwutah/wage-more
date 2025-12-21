// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundPage } from "./features/not-found-page";
import { DefaultErrorPage } from "./features/error-page";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ({ error }) => <DefaultErrorPage error={error} />,
  });

  return router;
}
