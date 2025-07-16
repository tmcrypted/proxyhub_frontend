import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root-route";
import AuthGuard from "./AuthGuard";

import Profile from "../../pages/Profile/Profile";
import UserBalance from "../../pages/user/UserBalance";
import UserTransactions from "../../pages/user/UserTransactions";
import UserOrders from "../../pages/user/UserOrders";
import UserProxies from "../../pages/user/UserProxies";
import UserReferrals from "../../pages/user/UserReferrals";
import Settings from "../../pages/Settings";

// Profile route - protected with AuthGuard and displays profile layout
export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  ),
});

// Profile routes - for both users and admins (admins only see settings)
export const profileBalanceRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/balance",
  component: UserBalance,
});

export const profileTransactionsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/transactions",
  component: UserTransactions,
});

export const profileOrdersRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/orders",
  component: UserOrders,
});

export const profileProxiesRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/proxies",
  component: UserProxies,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: Number(search.orderId) || undefined,
      page: Number(search.page) || 1,
      search: typeof search.search === 'string' ? search.search : '',
      status: typeof search.status === 'string' ? search.status : 'all',
    }
  },
});

export const profileReferralsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/referrals",
  component: UserReferrals,
});

export const profileSettingsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/settings",
  component: Settings,
}); 