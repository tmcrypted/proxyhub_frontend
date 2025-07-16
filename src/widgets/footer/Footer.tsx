import { Button } from "@/shared/components/ui/button"
import { useTranslation } from "react-i18next"
import { Shield, Github, Twitter, Mail, Globe } from "lucide-react"
import { useIsAdmin } from "@/entities/profile/model"

export function Footer() {
  const { t } = useTranslation()
  const isAdmin = useIsAdmin()

  // Logo component
  const logo = (
    <div className="relative">
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="relative w-6 h-6 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center transform rotate-12">
          <Shield className="h-3 w-3 text-white transform -rotate-12" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent rounded-lg"></div>
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg"></div>
        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
      </div>
    </div>
  )

  // Social links
  const socialLinks = [
    {
      icon: <Github className="h-4 w-4" />,
      href: "https://github.com/proxy-hub",
      label: "GitHub"
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      href: "https://twitter.com/proxy-hub",
      label: "Twitter"
    },
    {
      icon: <Mail className="h-4 w-4" />,
      href: "mailto:support@proxy-hub.com",
      label: "Email"
    },
    {
      icon: <Globe className="h-4 w-4" />,
      href: "https://proxy-hub.com",
      label: "Website"
    }
  ]

  // Main navigation links
  const mainLinks = [
    { href: "/", label: t("footer.links.home") },
    { href: "/buy", label: t("footer.links.buy") },
    { href: "/about", label: t("footer.links.about") },
    { href: "/profile", label: t("footer.links.profile") }
  ]

  // Legal links
  const legalLinks = [
    { href: "/privacy", label: t("footer.links.privacy") },
    { href: "/terms", label: t("footer.links.terms") },
    { href: "/cookies", label: t("footer.links.cookies") }
  ]

  // Copyright
  const copyright = {
    text: `© ${new Date().getFullYear()} Web3 Proxy Shop. ${t("footer.copyright.rights")}`,
    license: t("footer.copyright.license")
  }

  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24 border-t border-gray-200 dark:border-gray-800">
      <div className="px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2"
            aria-label="Web3 Proxy Shop"
          >
            {logo}
            <span className="font-bold text-xl">Web3 Proxy Shop</span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
        
        {/* Admin indicator */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-center text-muted-foreground">
              {t("footer.admin.indicator")}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
} 