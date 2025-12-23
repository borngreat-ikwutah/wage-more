import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "WageMore",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
  ssr: true, // Important for SSR support
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
