import { createRouter } from "@tanstack/react-router";
import * as TanStackQueryProvider from "../../shared/api/queryClient";


import { rootRoute } from "./root-route";


import {
  indexRoute,
  aboutRoute,
  errorRoute,
  authRoute,
  verifyEmailRoute,
} from "./public-routes";


import {
  profileRoute,
  profileBalanceRoute,
  profileTransactionsRoute,
  profileOrdersRoute,
  profileProxiesRoute,
  profileReferralsRoute,
  profileSettingsRoute,
} from "./profile-routes";


import {
  adminRoute,
  adminRootRoute,
  adminProxiesRoute,
  adminBranchesRoute,
  adminUsersRoute,
  adminOrdersRoute,
  adminPricingRoute,
} from "./admin-routes";

import { buyRoute } from "./buy-route";

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  errorRoute,
  buyRoute,
  authRoute,
  verifyEmailRoute,
  profileRoute.addChildren([
    profileBalanceRoute,
    profileTransactionsRoute,
    profileOrdersRoute,
    profileProxiesRoute,
    profileReferralsRoute,
    profileSettingsRoute,
  ]),
  adminRoute.addChildren([
    adminRootRoute,
    adminProxiesRoute,
    adminBranchesRoute,
    adminUsersRoute,
    adminOrdersRoute,
    adminPricingRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
} 