import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { config as appConfig } from "./config";

import Auth from "./pages/auth";
import EmailVerification from "./pages/email-verification";
import Profile from "./pages/profile/Profile";
import ProfileBalance from "./pages/profile/ProfileBalance";
import ProfileTransactions from "./pages/profile/ProfileTransactions";
import ProfileOrders from "./pages/profile/ProfileOrders";
import ProfileProxies from "./pages/profile/ProfileProxies";
import ProfileReferrals from "./pages/profile/ProfileReferrals";
import ProfileSettings from "./pages/profile/ProfileSettings";
import { BuyForm } from "./pages/buy.tsx";

import Header from "./components/Header.tsx";
import TanStackQueryLayout from "./integrations/tanstack-query/layout.tsx";
import { Footer } from "./components/ui/footer.tsx";
import { Hexagon, Send } from "lucide-react";
import App from "./App.tsx";
import { AdminGuard } from "./components/AdminGuard.tsx";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

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
            href: appConfig.external.exampleUrl,
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

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  component: EmailVerification,
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

const profileProxiesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/proxies",
  component: ProfileProxies,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: Number(search.orderId) || undefined,
      page: Number(search.page) || 1,
      search: typeof search.search === 'string' ? search.search : '',
      status: typeof search.status === 'string' ? search.status : 'all',
    }
  },
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
  component: () => (
    <AdminGuard>
      <div>Proxies Management</div>
    </AdminGuard>
  ),
});

const profileAdminBranchesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/branches",
  component: () => (
    <AdminGuard>
      <div>Branches Management</div>
    </AdminGuard>
  ),
});

const profileAdminUsersRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/users",
  component: () => (
    <AdminGuard>
      <div>Users Management</div>
    </AdminGuard>
  ),
});

const profileAdminOrdersRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/orders",
  component: () => (
    <AdminGuard>
      <div>Orders Management</div>
    </AdminGuard>
  ),
});

const profileAdminPricingRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/pricing",
  component: () => (
    <AdminGuard>
      <div>Pricing Management</div>
    </AdminGuard>
  ),
});

const profileAdminPromoCodesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin/promo-codes",
  component: () => (
    <AdminGuard>
      <div>Promo Codes Management</div>
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  BuyForm(rootRoute),
  authRoute,
  verifyEmailRoute,
  profileRoute.addChildren([
    profileBalanceRoute,
    profileTransactionsRoute,
    profileOrdersRoute,
    profileProxiesRoute,
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

export const router = createRouter({
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