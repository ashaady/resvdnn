import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { useOrders, Order, OrderStatus } from "@/context/OrdersContext";
import { ChevronRight, Clock, User, Phone, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  in_preparation: "En préparation",
  ready: "Prêt",
  completed: "Complétée",
};

const STATUS_ICONS: Record<OrderStatus, string> = {
  pending: "⏳",
  in_preparation: "👨‍🍳",
  ready: "✅",
  completed: "🎉",
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchParams] = useSearchParams();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("à l'instant");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Map URL status parameter to actual OrderStatus
  const mapStatusParam = (param: string | null): OrderStatus | null => {
    if (!param) return null;
    const statusMap: Record<string, OrderStatus> = {
      pending: "pending",
      in_attente: "pending",
      attente: "pending",
      preparing: "in_preparation",
      en_preparation: "in_preparation",
      preparation: "in_preparation",
      ready: "ready",
      pret: "ready",
      completed: "completed",
      completee: "completed",
    };
    return statusMap[param.toLowerCase()] || null;
  };

  const statusFilter = mapStatusParam(searchParams.get("status"));

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const preparingOrders = orders.filter(
    (o) => o.status === "in_preparation",
  ).length;
  const readyOrders = orders.filter((o) => o.status === "ready").length;

  const avgPreparationTime =
    orders.length > 0
      ? Math.round(orders.reduce((sum) => sum + 15, 0) / orders.length)
      : 0;

  // Filter orders based on status and search query
  useEffect(() => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.fullName.toLowerCase().includes(query) ||
          order.phone.toLowerCase().includes(query),
      );
    }

    setFilteredOrders(filtered.slice(0, 20)); // Show up to 20 orders
  }, [searchQuery, orders, statusFilter]);

  // Auto-refresh orders every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setLastRefresh(getRelativeTime(new Date()));
        setIsRefreshing(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getRelativeTime = (date: Date | string): string => {
    const orderDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `il y a ${diffDays}j`;
  };

  const getStatusTitle = () => {
    if (!statusFilter) return "Toutes les commandes";
    return STATUS_LABELS[statusFilter];
  };

  return (
    <AdminLayout
      title="Commandes"
      searchPlaceholder="Rechercher une commande, client..."
      onSearch={setSearchQuery}
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <StatsCard
            title="Total commandes"
            value={totalOrders}
            icon="📦"
            trend={{ percentage: 12, positive: true }}
            borderColor="#F58220"
          />
          <StatsCard
            title={STATUS_LABELS.pending}
            value={pendingOrders}
            icon={STATUS_ICONS.pending}
            trend={{ percentage: 5, positive: false }}
            borderColor="#F59E0B"
          />
          <StatsCard
            title={STATUS_LABELS.in_preparation}
            value={preparingOrders}
            icon={STATUS_ICONS.in_preparation}
            trend={{ percentage: 8, positive: true }}
            borderColor="#F58220"
          />
          <StatsCard
            title={STATUS_LABELS.ready}
            value={readyOrders}
            icon={STATUS_ICONS.ready}
            trend={{ percentage: 3, positive: true }}
            borderColor="#3B82F6"
          />
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-[#D4AF37]">
            <div>
              <h2 className="text-xl font-playfair font-bold text-[#6B3E26]">
                {getStatusTitle()}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-sm text-[#999999] font-lato">
                    Auto-refresh {autoRefresh ? "activé" : "désactivé"}
                  </p>
                </div>
                <p className="text-xs text-[#999999] font-lato">
                  {lastRefresh !== "à l'instant" ? `Actualisé ${lastRefresh}` : "Actualisé à l'instant"}
                </p>
                <button
                  onClick={() => setIsRefreshing(true)}
                  className={`p-1 hover:bg-[#F5F5F5] rounded transition-all ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                  title="Rafraîchir"
                >
                  <RefreshCw size={16} className="text-[#F58220]" />
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    autoRefresh
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {autoRefresh ? "Pause" : "Reprendre"}
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F5F5F5] bg-[#F5F5F5]">
                  <th className="px-6 py-3 text-left text-xs font-playfair font-bold text-[#6B3E26]">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-playfair font-bold text-[#6B3E26]">
                    N° Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-playfair font-bold text-[#6B3E26]">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-playfair font-bold text-[#6B3E26]">
                    Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-playfair font-bold text-[#6B3E26]">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-playfair font-bold text-[#6B3E26]">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-playfair font-bold text-[#6B3E26]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors animate-fade-in"
                  >
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-playfair font-bold text-[#6B3E26]">
                        {order.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-lato font-semibold text-[#6B3E26]">
                          {order.fullName}
                        </p>
                        <p className="text-sm text-[#999999] font-lato">
                          {order.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-lato text-[#999999]">
                        {getRelativeTime(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-lato">
                        {order.deliveryType === "delivery" ? "🚚" : "🏠"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-playfair font-bold text-[#F58220]">
                        {order.total.toLocaleString()} F
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-[#F58220] hover:text-[#E06E10] transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Orders Cards - Mobile */}
          <div className="md:hidden space-y-3 p-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-[#D4AF37] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer card-hover animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-playfair font-bold text-[#6B3E26]">
                      {order.id}
                    </p>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <p className="font-playfair font-bold text-[#F58220]">
                    {order.total.toLocaleString()} F
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#999999]" />
                    <span className="font-lato text-[#6B3E26]">
                      {order.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-[#999999]" />
                    <span className="font-lato text-[#6B3E26]">
                      {order.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#999999]" />
                    <span className="font-lato text-[#999999]">
                      {getRelativeTime(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#999999] font-lato">
                Aucune commande trouvée
              </p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={showOrderModal}
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onStatusChange={(orderId, newStatus) => {
            updateOrderStatus(orderId, newStatus as OrderStatus);
            setShowOrderModal(false);
          }}
        />
      </div>
    </AdminLayout>
  );
}
