import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plus, Wifi, Search, Filter, Upload } from "lucide-react";
import type {
  Proxy,
  CreateProxyData,
  UpdateProxyData,
  ProxyFilters,
} from "../model/types";
import { useProxyStore } from "../model/store";
import {
  usePaginatedProxies,
  useLoading,
  useError,
  useFilters,
  useActiveFiltersCount,
} from "../model/selectors";
import { ProxyTable } from "./ProxyTable.tsx";
import { ProxyForm } from "./ProxyForm.tsx";
import { ProxyFiltersComponent } from "./ProxyFilters.tsx";
import { ProxyStats } from "./ProxyStats.tsx";
import { ProxyPagination } from "./ProxyPagination.tsx";
import { ProxyBatchImport } from "./ProxyBatchImport.tsx";
import {
  useCreateProxy,
  useUpdateProxy,
  useDeleteProxy,
  useBulkUpdateProxies,
  useBulkDeleteProxies,
  useProxies,
} from "../hooks/useProxies.ts";

type TabType = "none" | "filters" | "batch-import" | "add-proxy" | "edit-proxy";

const AdminProxyManagement = () => {
  const { t } = useTranslation();
  const loading = useLoading();
  const [activeTab, setActiveTab] = useState<TabType>("none");

  // const filters = useFilters();
  const [filters, setFilters] = useState<ProxyFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProxy, setEditingProxy] = useState<Proxy | null>(null);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const { data: proxies = [], isLoading, error, refetch } = useProxies(filters);

  const activeFiltersCount = useActiveFiltersCount();

  const createProxyMutation = useCreateProxy();
  const updateProxyMutation = useUpdateProxy();
  const deleteProxyMutation = useDeleteProxy();
  const bulkUpdateMutation = useBulkUpdateProxies();
  const bulkDeleteMutation = useBulkDeleteProxies();

  const handleCreateProxy = async (data: any) => {
    try {
      await createProxyMutation.mutateAsync(data);
      // setShowForm(false);
      // Кэш автоматически инвалидируется!
    } catch (error) {
      console.error("Failed to create proxy:", error);
    }
  };

  const handleUpdateProxy = async (id: number, data: any) => {
    try {
      await updateProxyMutation.mutateAsync({ id, data });
      setEditingProxy(null);
      // Кэш автоматически инвалидируется!
    } catch (error) {
      console.error("Failed to update proxy:", error);
    }
  };

  const handleDeleteProxy = async (id: number) => {
    if (!confirm("Are you sure you want to delete this proxy?")) return;

    try {
      await deleteProxyMutation.mutateAsync(id);
      // Кэш автоматически инвалидируется!
    } catch (error) {
      console.error("Failed to delete proxy:", error);
    }
  };

  const handleBulkUpdate = async (ids: number[], updates: Partial<Proxy>) => {
    try {
      await bulkUpdateMutation.mutateAsync({ ids, updates });
      // Кэш автоматически инвалидируется!
    } catch (error) {
      console.error("Failed to bulk update proxies:", error);
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} proxies?`))
      return;

    try {
      await bulkDeleteMutation.mutateAsync(ids);
      // Кэш автоматически инвалидируется!
    } catch (error) {
      console.error("Failed to bulk delete proxies:", error);
    }
  };

  const handleEditProxy = (proxy: Proxy) => {
    setEditingProxy(proxy);
    setActiveTab("edit-proxy");
  };

  const handleCloseTab = () => {
    setActiveTab("none");
    setEditingProxy(null);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const isTabActive = (tab: TabType) => activeTab === tab;

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-200 font-medium">
            Error loading proxies
          </h3>
          <p className="text-red-600 dark:text-red-300 mt-1">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading && proxies.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Proxy Management</h3>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Proxy Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                Loading proxies...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Proxy Management</h3>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Proxy Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProxyStats />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Proxy Management</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={isTabActive("filters") ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setActiveTab(isTabActive("filters") ? "none" : "filters")
            }
            className="transition-all duration-200 relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span
                className={`ml-2 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium ${
                  isTabActive("filters")
                    ? "ring-1 ring-white dark:ring-black"
                    : ""
                }`}
              >
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button
            variant={isTabActive("batch-import") ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setActiveTab(
                isTabActive("batch-import") ? "none" : "batch-import"
              )
            }
            className="transition-all duration-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            Batch Import
          </Button>
          <Button
            variant={isTabActive("add-proxy") ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setActiveTab(isTabActive("add-proxy") ? "none" : "add-proxy")
            }
            className="transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Proxy
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "filters" && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <ProxyFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        )}

        {activeTab === "batch-import" && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <ProxyBatchImport onClose={handleCloseTab} />
          </div>
        )}

        {(activeTab === "add-proxy" || activeTab === "edit-proxy") && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <ProxyForm
              proxy={editingProxy}
              onSubmit={async (data: CreateProxyData | UpdateProxyData) => {
                if (editingProxy) {
                  await handleUpdateProxy(
                    editingProxy.id,
                    data as UpdateProxyData
                  );
                } else {
                  await handleCreateProxy(data as CreateProxyData);
                }
              }}
              onCancel={handleCloseTab}
            />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Proxy Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProxyTable
            proxies={proxies}
            onEdit={handleEditProxy}
            onDelete={handleDeleteProxy}
            onBulkUpdate={handleBulkUpdate}
            onBulkDelete={handleBulkDelete}
          />
          <ProxyPagination />
        </CardContent>
      </Card>
    </div>
  );
};

export { AdminProxyManagement };
