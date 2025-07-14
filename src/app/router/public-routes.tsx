import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root-route";

import Auth from "../../pages/Auth/Auth";
import EmailVerification from "../../pages/email-verification";
import Home from "../../pages/Home/Home";
import About from "../../pages/About/About";
import { ErrorPage } from "../../pages/ErrorPage/ErrorPage";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

export const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/error",
  component: ErrorPage,
});

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: Auth,
});

export const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  component: EmailVerification,
}); 