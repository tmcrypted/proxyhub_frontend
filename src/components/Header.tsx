import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { LanguageToggle } from "./language-toggle";
import { Button } from "./ui/button";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";
import { User, Crown, DollarSign, ShoppingCart, Shield, Zap } from "lucide-react";
import DiscountBanner from "./DiscountBanner";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useUserBalance } from "@/hooks/useUserBalance";
import { useState } from "react";
import BalanceDisplay from "./BalanceDisplay";

export default function Header() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const isAdmin = useIsAdmin();
  const { balance, isLoading: balanceLoading } = useUserBalance();
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);

  const handleCloseBanner = () => {
    setShowDiscountBanner(false);
  };

  return (
    <>
      {/* Discount Banner - only show for non-admin users */}
      {/* {!isAdmin && showDiscountBanner && (
        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-7xl mx-auto">
            <DiscountBanner
              discount={20}
              code="WELCOME20"
              expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
              onClose={handleCloseBanner}
            />
          </div>
        </div>
      )} */}
      <header className="p-2 flex gap-2 bg-background text-foreground justify-between items-center">
        <nav className="flex flex-row items-center gap-6">
          <div className="px-2">
            <Link to="/" className="group flex items-center gap-3 hover:opacity-80 transition-all duration-300">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="relative w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <Shield className="h-4 w-4 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent rounded-lg"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wide text-gray-800 dark:text-gray-200">WEB3</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium tracking-wide">PROXY SHOP</span>
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-300 mt-1"></div>
              </div>
            </Link>
          </div>
          {isAuthenticated && (
            <Link to="/buy" className="group">
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 border-2 border-black dark:border-white hover:border-gray-600 dark:hover:border-gray-400 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <ShoppingCart className="h-3.5 w-3.5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs relative z-10 tracking-wide">BUY</span>
              </div>
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Admin Badge */}
              {isAdmin && (
                <Link to="/admin">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                    <Crown className="h-3 w-3" />
                    <span>{t("header.admin")}</span>
                  </div>
                </Link>
              )}

              {/* Balance Display for non-admin users */}
              {!isAdmin && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <DollarSign className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {balanceLoading ? (
                      <span className="animate-pulse">
                        {t("header.loading")}
                      </span>
                    ) : (
                      `${balance?.toFixed(2) || "0.00"} USDC`
                    )}
                  </span>
                </div>
              )}
              {/* {!isAdmin && <BalanceDisplay />} */}

              <Link to="/profile">
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <Button asChild>
              <Link to="/auth">{t("auth.login.button")}</Link>
            </Button>
          )}
          <ModeToggle />
          <LanguageToggle />
        </div>
      </header>
    </>
  );
}
