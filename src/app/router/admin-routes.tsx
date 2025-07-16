import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./root-route";
import { AdminGuard } from "./AdminGuard";
import AuthGuard from "./AuthGuard";
import React from "react";

import { AdminPanel } from "../../pages/admin/AdminPanel/AdminPanel";
import AdminProxies from "../../pages/admin/AdminProxies";
import AdminBranches from "../../pages/admin/AdminBranches";
import AdminUsers from "../../pages/admin/AdminUsers";
import AdminOrders from "../../pages/admin/AdminOrders";
import AdminPricing from "../../pages/admin/AdminPricing";

// Admin panel route - protected with both AuthGuard and AdminGuard
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AuthGuard>
      <AdminGuard>
        <AdminPanel />
      </AdminGuard>
    </AuthGuard>
  ),
});

// Admin root redirect
export const adminRootRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: () => {
    const navigate = useNavigate()
    React.useEffect(() => {
      navigate({ to: '/admin/proxies' })
    }, [navigate])
    return null
  },
});

// Admin routes - completely separate admin functionality
export const adminProxiesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/proxies",
  component: AdminProxies,
});

export const adminBranchesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/branches",
  component: AdminBranches,
});

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: AdminUsers,
});

export const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/orders",
  component: AdminOrders,
});

export const adminPricingRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/pricing",
  component: AdminPricing,
}); 