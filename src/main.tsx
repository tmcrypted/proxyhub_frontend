import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import FormSimpleDemo from "./routes/demo.form.simple.tsx";
import FormAddressDemo from "./routes/demo.form.address.tsx";
import StoreDemo from "./routes/demo.store.tsx";
import TanStackQueryDemo from "./routes/demo.tanstack-query.tsx";
import Auth from "./pages/auth";
import Register from "./pages/register";
import AuthCallback from "./pages/auth-callback";
import Profile from "./pages/profile/Profile";
import ProfileBalance from "./pages/profile/ProfileBalance";
import ProfileTransactions from "./pages/profile/ProfileTransactions";
import ProfileOrders from "./pages/profile/ProfileOrders";
import ProfileReferrals from "./pages/profile/ProfileReferrals";
import ProfileSettings from "./pages/profile/ProfileSettings";
import { AuthProvider } from "./contexts/AuthContext";

import Header from "./components/Header.tsx";

import TanStackQueryLayout from "./integrations/tanstack-query/layout.tsx";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import "@rainbow-me/rainbowkit/styles.css";
import "./styles.css";

import App from "./App.tsx";
import { ThemeProvider } from "./contexts/theme-provider.tsx";

// Import i18n configuration
import "./lib/i18n";
import { Footer } from "./components/ui/footer.tsx";
import { Hexagon, Send } from "lucide-react";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "./lib/wagmi";
import { mainnet } from "viem/chains";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Proxy Hub"
        socialLinks={[
          {
            icon: <Send className="h-5 w-5" />,
            href: "https://example.com",
            label: "Telegram",
          },
        ]}
        mainLinks={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: "© 2025 Proxy Hub",
          license: "All rights reserved",
        }}
      />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: Auth,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: AuthCallback,
});

const googleCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/google/callback",
  component: AuthCallback,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const profileBalanceRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/",
  component: ProfileBalance,
});

const profileTransactionsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/transactions",
  component: ProfileTransactions,
});

const profileOrdersRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/orders",
  component: ProfileOrders,
});

const profileReferralsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/referrals",
  component: ProfileReferrals,
});

const profileSettingsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/settings",
  component: ProfileSettings,
});

// Admin routes
const profileAdminProxiesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/proxies",
  component: () => <div>Proxies Management</div>,
});

const profileAdminBranchesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/branches",
  component: () => <div>Branches Management</div>,
});

const profileAdminUsersRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/users",
  component: () => <div>Users Management</div>,
});

const profileAdminOrdersRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/orders",
  component: () => <div>Orders Management</div>,
});

const profileAdminPricingRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/pricing",
  component: () => <div>Pricing Management</div>,
});

const profileAdminPromoCodesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/promo-codes",
  component: () => <div>Promo Codes Management</div>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  FormSimpleDemo(rootRoute),
  FormAddressDemo(rootRoute),
  StoreDemo(rootRoute),
  TanStackQueryDemo(rootRoute),
  authRoute,
  registerRoute,
  authCallbackRoute,
  googleCallbackRoute,
  profileRoute.addChildren([
    profileBalanceRoute,
    profileTransactionsRoute,
    profileOrdersRoute,
    profileReferralsRoute,
    profileSettingsRoute,
    profileAdminProxiesRoute,
    profileAdminBranchesRoute,
    profileAdminUsersRoute,
    profileAdminOrdersRoute,
    profileAdminPricingRoute,
    profileAdminPromoCodesRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <WagmiProvider config={config}>
        <TanStackQueryProvider.Provider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RainbowKitProvider theme={darkTheme()} chains={[mainnet]}>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
            </RainbowKitProvider>
          </ThemeProvider>
        </TanStackQueryProvider.Provider>
      </WagmiProvider>
    </StrictMode>
  );
}
