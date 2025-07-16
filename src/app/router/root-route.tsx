import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Header } from "../../widgets/header";
import { Footer } from "../../widgets/footer";
import { Modal } from "@/shared/components/Modal";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Modal />
      <TanStackRouterDevtools />
       <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
}); 