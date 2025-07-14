import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/theme-provider.tsx";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../lib/wagmi";
import { router } from "./router";

// Import wallet provider conflict handling
import "../lib/wallet-provider";
import WalletErrorBoundary from "../components/WalletErrorBoundary";

import * as TanStackQueryProvider from "../integrations/tanstack-query/root-provider.tsx";

import "@rainbow-me/rainbowkit/styles.css";
import "./styles.css";

// Import i18n configuration
import "../lib/i18n";

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <WagmiProvider config={config}>
        <TanStackQueryProvider.Provider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <WalletErrorBoundary>
              <RainbowKitProvider theme={darkTheme()}>
                <AuthProvider>
                  <RouterProvider router={router} />
                </AuthProvider>
              </RainbowKitProvider>
            </WalletErrorBoundary>
          </ThemeProvider>
        </TanStackQueryProvider.Provider>
      </WagmiProvider>
    </StrictMode>
  );
}
