import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Plus, GitBranch } from "lucide-react";
import type { Branch, CreateBranchData, UpdateBranchData } from "../model/types";
import { useBranchStore } from "../model/store";
import { useBranches, useLoading, useError } from "../model/selectors";
import { BranchTable } from "./BranchTable.tsx";
import { BranchForm } from "./BranchForm.tsx";
import { BranchStats } from "./BranchStats.tsx";

type TabType = "none" | "add-branch" | "edit-branch";

const AdminBranchManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("none");
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Store hooks
  const {
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  } = useBranchStore();
  const branches = useBranches();
  const loading = useLoading();
  const error = useError();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCreateBranch = async (data: CreateBranchData) => {
    try {
      await createBranch(data);
      setActiveTab("none");
    } catch (err) {
      console.error("Error creating branch:", err);
      throw err;
    }
  };

  const handleUpdateBranch = async (id: number, data: UpdateBranchData) => {
    try {
      await updateBranch(id, data);
      setActiveTab("none");
      setEditingBranch(null);
    } catch (err) {
      console.error("Error updating branch:", err);
      throw err;
    }
  };

  const handleDeleteBranch = async (id: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    await deleteBranch(id);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setActiveTab("edit-branch");
  };

  const handleCloseTab = () => {
    setActiveTab("none");
    setEditingBranch(null);
  };

  const isTabActive = (tab: TabType) => activeTab === tab;

  return (
    <div className="space-y-6">
      <BranchStats />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Branch Management</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={isTabActive("add-branch") ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setActiveTab(isTabActive("add-branch") ? "none" : "add-branch")
            }
            className="transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {(activeTab === "add-branch" || activeTab === "edit-branch") && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <BranchForm
              branch={editingBranch}
              onSubmit={async (data: CreateBranchData | UpdateBranchData) => {
                if (editingBranch) {
                  await handleUpdateBranch(editingBranch.id, data as UpdateBranchData);
                } else {
                  await handleCreateBranch(data as CreateBranchData);
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
            <GitBranch className="w-5 h-5" />
            Branch Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BranchTable
            branches={branches}
            onEdit={handleEditBranch}
            onDelete={handleDeleteBranch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBranchManagement; 