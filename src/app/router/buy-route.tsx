import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root-route";
import { BuyForm } from "@/pages/buy/Buy";

export const buyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buy',
  component: BuyForm,
}); 