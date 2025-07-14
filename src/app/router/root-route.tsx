import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { config as appConfig } from "../../config";
import { Hexagon, Send } from "lucide-react";

import Header from "../../components/Header";
import { Footer } from "../../components/ui/footer";
import TanStackQueryLayout from "../../integrations/tanstack-query/layout";

export const rootRoute = createRootRoute({
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