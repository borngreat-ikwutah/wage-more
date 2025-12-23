/// <reference types="vite/client" />
import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import appCss from "../styles.css?url";
import { seoConfig } from "../seo";
import { Toaster } from "~/components/ui/sonner";

// Import RainbowKit styles
import "@rainbow-me/rainbowkit/styles.css";

import type { QueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: seoConfig.meta,
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      ...seoConfig.faviconLinks,
    ],
  }),
  shellComponent: RootDocument,
});

function ClientOnlyRainbowKit({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{children}</>;
  }

  return (
    <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
        <ClientOnlyRainbowKit>{children}</ClientOnlyRainbowKit>
        {process.env.NODE_ENV === "development" && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "React Query",
                render: <ReactQueryDevtools />,
              },
            ]}
          />
        )}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
