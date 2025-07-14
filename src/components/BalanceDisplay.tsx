import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useUserBalance } from "../hooks/useUserBalance";

interface MockTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "purchase";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const mockTransactions: MockTransaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 100.0,
    description: "Balance top-up",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "purchase",
    amount: -25.5,
    description: "Proxy purchase - US servers",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "deposit",
    amount: 50.0,
    description: "Balance top-up",
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "4",
    type: "purchase",
    amount: -15.75,
    description: "Proxy renewal - EU servers",
    date: "2024-01-08",
    status: "completed",
  },
  {
    id: "5",
    type: "withdrawal",
    amount: -30.0,
    description: "Withdrawal to wallet",
    date: "2024-01-05",
    status: "pending",
  },
];

const BalanceDisplay = () => {
  const { t } = useTranslation();
  const { balance, isLoading } = useUserBalance();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} USDC`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case "failed":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {/* Balance Display */}
      <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <DollarSign className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isLoading ? (
            <span className="animate-pulse">{t("header.loading")}</span>
          ) : (
            `${balance?.toFixed(2) || "0.00"} USDC`
          )}
        </span>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {t("header.balance")}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? (
                <span className="animate-pulse">{t("header.loading")}</span>
              ) : (
                formatAmount(balance || 0)
              )}
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="p-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t("header.recentActivity")}
            </h4>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        transaction.amount > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatAmount(transaction.amount)}
                    </p>
                    <p
                      className={`text-xs ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              {t("header.viewAllTransactions")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceDisplay;
