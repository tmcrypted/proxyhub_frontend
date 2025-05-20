import { Link } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'
import { LanguageToggle } from './language-toggle'
import { Button } from './ui/button'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import { User } from 'lucide-react'
import DiscountBanner from './DiscountBanner'
import useIsAdmin from '@/hooks/useIsAdmin'

export default function Header() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const isAdmin = useIsAdmin()

  return (
    <>
      {/* Discount Banner - only show for non-admin users */}
      {!isAdmin && (
        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-7xl mx-auto">
            <DiscountBanner
              discount={20}
              code="WELCOME20"
              expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
            />
          </div>
        </div>
      )}
      <header className="p-2 flex gap-2 bg-background text-foreground justify-between">
        <nav className="flex flex-row">
          <div className="px-2 font-bold">
            <Link to="/demo/form/simple">Proxy Hub</Link>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <Button asChild>
              <Link to="/auth">{t('auth.login.button')}</Link>
            </Button>
          )}
          <ModeToggle />
          <LanguageToggle />
        </div>
      </header>
    </>
  )
}
