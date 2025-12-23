import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ThemeProvider } from "./theme-provider";
import { config } from "~/lib/wagmi-config";

// Create query client
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function getContext() {
  const queryClient = createQueryClient();

  return {
    queryClient,
  };
}

interface ProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

// Inner providers (for router integration) - no HTML structure
export function InnerProviders({ children, queryClient }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
