import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { User, UpdateUserData } from "../model/types";
import { useUserStore } from "../model/store";
import { useUsers, useLoading, useError } from "../model/selectors";
import { UserTable } from "./UserTable.tsx";
import { UserForm } from "./UserForm.tsx";
import { UserStats } from "./UserStats.tsx";

type TabType = "none" | "edit-user";

const AdminUserManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("none");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Store hooks
  const {
    fetchUsers,
    updateUser,
    deleteUser,
  } = useUserStore();
  const users = useUsers();
  const loading = useLoading();
  const error = useError();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateUser = async (id: number, data: UpdateUserData) => {
    try {
      await updateUser(id, data);
      setActiveTab("none");
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setActiveTab("edit-user");
  };

  const handleCloseTab = () => {
    setActiveTab("none");
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <UserStats />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">User Management</h3>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "edit-user" && editingUser && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <UserForm
              user={editingUser}
              onSubmit={async (data: UpdateUserData) => {
                await handleUpdateUser(editingUser.id, data);
              }}
              onCancel={handleCloseTab}
            />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement; 