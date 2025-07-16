import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "@/shared/lib/theme-provider.tsx";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../shared/lib/wagmi.ts";
import { router } from "./router";

// Import wallet provider conflict handling
import "../shared/lib/wallet-provider.ts";
import WalletErrorBoundary from "../shared/components/WalletErrorBoundary.tsx";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/queryClient";

import { AuthProvider } from "@/shared/api/authProvider";

import "@rainbow-me/rainbowkit/styles.css";
import "./styles.css";

// Import i18n configuration
import "../shared/lib/i18n.ts";

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
              <WalletErrorBoundary>
                <RainbowKitProvider theme={darkTheme()}>
                  <RouterProvider router={router} />
                </RainbowKitProvider>
              </WalletErrorBoundary>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
}
