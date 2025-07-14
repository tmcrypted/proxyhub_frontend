import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { Order, UpdateOrderData } from "../model/types";
import { useOrderStore } from "../model/store";
import { useOrders, useLoading, useError } from "../model/selectors";
import { OrderTable } from "./OrderTable.tsx";
import { OrderForm } from "./OrderForm.tsx";
import { OrderStats } from "./OrderStats.tsx";

type TabType = "none" | "edit-order";

const AdminOrderManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("none");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Store hooks
  const {
    fetchOrders,
    updateOrder,
    deleteOrder,
    markOrderAsPaid,
  } = useOrderStore();
  const orders = useOrders();
  const loading = useLoading();
  const error = useError();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateOrder = async (id: number, data: UpdateOrderData) => {
    try {
      await updateOrder(id, data);
      setActiveTab("none");
      setEditingOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
      throw err;
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    await deleteOrder(id);
  };

  const handleMarkAsPaid = async (id: number) => {
    if (!confirm("Are you sure you want to mark this order as paid?")) return;
    await markOrderAsPaid(id);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setActiveTab("edit-order");
  };

  const handleCloseTab = () => {
    setActiveTab("none");
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      <OrderStats />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Order Management</h3>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "edit-order" && editingOrder && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <OrderForm
              order={editingOrder}
              onSubmit={async (data: UpdateOrderData) => {
                await handleUpdateOrder(editingOrder.id, data);
              }}
              onCancel={handleCloseTab}
            />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={orders}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onMarkAsPaid={handleMarkAsPaid}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderManagement; 