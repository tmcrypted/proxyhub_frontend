import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wifi, Search, Filter, Upload } from "lucide-react";
import type { Proxy, CreateProxyData, UpdateProxyData } from "../model/types";
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

type TabType = "none" | "filters" | "batch-import" | "add-proxy" | "edit-proxy";

const AdminProxyManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("none");
  const [editingProxy, setEditingProxy] = useState<Proxy | null>(null);

  // Store hooks
  const {
    fetchProxies,
    createProxy,
    updateProxy,
    deleteProxy,
    bulkUpdateProxies,
    bulkDeleteProxies,
    setFilters,
  } = useProxyStore();
  const proxies = usePaginatedProxies();
  const loading = useLoading();
  const error = useError();
  const filters = useFilters();
  const activeFiltersCount = useActiveFiltersCount();

  useEffect(() => {
    fetchProxies();
  }, [fetchProxies]);

  const handleCreateProxy = async (data: CreateProxyData) => {
    try {
      await createProxy(data);
      setActiveTab("none");
    } catch (err) {
      console.error("Error creating proxy:", err);
      throw err;
    }
  };

  const handleUpdateProxy = async (id: number, data: UpdateProxyData) => {
    try {
      await updateProxy(id, data);
      setActiveTab("none");
      setEditingProxy(null);
    } catch (err) {
      console.error("Error updating proxy:", err);
      throw err;
    }
  };

  const handleDeleteProxy = async (id: number) => {
    if (!confirm("Are you sure you want to delete this proxy?")) return;
    await deleteProxy(id);
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
              <Button onClick={() => fetchProxies()}>Try Again</Button>
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
              <span className={`ml-2 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium ${
                isTabActive("filters") ? "ring-1 ring-white dark:ring-black" : ""
              }`}>
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
                  await handleUpdateProxy(editingProxy.id, data as UpdateProxyData);
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
            onBulkUpdate={bulkUpdateProxies}
            onBulkDelete={bulkDeleteProxies}
          />
          <ProxyPagination />
        </CardContent>
      </Card>
    </div>
  );
};

export { AdminProxyManagement };
