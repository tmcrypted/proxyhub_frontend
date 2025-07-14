import { Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AdminPanelSidebar } from "./AdminPanelSidebar";

export const AdminPanel = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{t("profile.adminTitle")}</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <AdminPanelSidebar />
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md min-h-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
