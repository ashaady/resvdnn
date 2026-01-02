import { useState } from "react";
import { X, Phone, MapPin, Clock, User, MessageSquare, Printer } from "lucide-react";
import { Order, OrderStatus } from "@/context/OrdersContext";
import ActionButton from "./ActionButton";
import StatusBadge from "./StatusBadge";

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus, note?: string) => void;
}

// Map order status to available actions
const statusActions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["in_preparation"],
  in_preparation: ["ready"],
  ready: ["completed"],
  completed: [],
};

export default function OrderDetailsModal({
  isOpen,
  order,
  onClose,
  onStatusChange,
}: OrderDetailsModalProps) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Array<{ text: string; author: string; date: string }>>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleAddNote = () => {
    if (noteText.trim()) {
      setNotes([
        ...notes,
        {
          text: noteText,
          author: "Admin",
          date: new Date().toLocaleString("fr-FR"),
        },
      ]);
      setNoteText("");
    }
  };

  const handleStatusAction = async (newStatus: OrderStatus) => {
    setLoadingAction(newStatus);
    setTimeout(() => {
      onStatusChange(order.id, newStatus, noteText);
      setLoadingAction(null);
    }, 500);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `il y a ${diffDays}j`;
  };

  const getActionLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: "Confirmer & Préparer",
      in_preparation: "Marquer comme prête",
      ready: "Marquer comme livrée",
      completed: "Complétée",
    };
    return labels[status];
  };

  const actions = statusActions[order.status] || [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#6B3E26] to-[#9C6B4A] text-white px-8 py-6 flex items-center justify-between border-b border-[#F58220]">
            <div>
              <p className="text-sm font-lato opacity-80">Commande N°</p>
              <h2 className="text-3xl font-playfair font-bold">{order.id}</h2>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={order.status} size="lg" />
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            {/* Main Content - Left & Center (60%) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Information */}
              <div className="bg-[#F5F5F5] rounded-lg p-6 space-y-4">
                <h3 className="font-playfair font-bold text-[#6B3E26] text-lg">
                  Informations
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-lato text-[#999999] uppercase mb-1">
                      Type Commande
                    </p>
                    <p className="font-playfair font-bold text-[#6B3E26]">
                      {order.deliveryType === "delivery" ? "🚚 Livraison" : "🏠 À emporter"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-lato text-[#999999] uppercase mb-1">
                      Date/Heure
                    </p>
                    <p className="font-playfair font-bold text-[#6B3E26]">
                      {new Date(order.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#D4AF37] pt-4 flex items-center gap-3">
                  <Clock size={16} className="text-[#F58220]" />
                  <div>
                    <p className="text-xs font-lato text-[#999999] uppercase">
                      Temps depuis création
                    </p>
                    <p className="font-lato text-[#6B3E26] font-semibold">
                      {formatTime(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white border-2 border-[#D4AF37] rounded-lg p-6 space-y-4">
                <h3 className="font-playfair font-bold text-[#6B3E26] text-lg">
                  Client
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-[#F58220]" />
                    <div>
                      <p className="text-xs font-lato text-[#999999]">Nom</p>
                      <p className="font-lato font-semibold text-[#6B3E26]">
                        {order.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#F58220]" />
                    <div>
                      <p className="text-xs font-lato text-[#999999]">Téléphone</p>
                      <a
                        href={`tel:${order.phone}`}
                        className="font-lato font-semibold text-[#F58220] hover:underline"
                      >
                        {order.phone}
                      </a>
                    </div>
                  </div>

                  {order.deliveryType === "delivery" && (
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#F58220] mt-1" />
                      <div>
                        <p className="text-xs font-lato text-[#999999]">Adresse</p>
                        <p className="font-lato font-semibold text-[#6B3E26]">
                          {order.address || "Non spécifiée"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#D4AF37] pt-4 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-lato font-semibold transition-colors text-sm">
                    💬 WhatsApp
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-lato font-semibold transition-colors text-sm">
                    📞 Appeler
                  </button>
                </div>
              </div>

              {/* Produits */}
              <div className="bg-white border-2 border-[#D4AF37] rounded-lg p-6">
                <h3 className="font-playfair font-bold text-[#6B3E26] text-lg mb-4">
                  Produits
                </h3>

                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-[#F5F5F5] last:border-0">
                      <div>
                        <p className="font-lato font-semibold text-[#6B3E26]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#999999] font-lato">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-playfair font-bold text-[#F58220]">
                        {(item.price * item.quantity).toLocaleString()} F
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-[#D4AF37] mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-lato">
                    <span className="text-[#999999]">Sous-total</span>
                    <span className="text-[#6B3E26] font-semibold">
                      {(order.total - 1000).toLocaleString()} F
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-lato">
                    <span className="text-[#999999]">Frais de livraison</span>
                    <span className="text-[#6B3E26] font-semibold">
                      {order.deliveryType === "delivery" ? "1 000 F" : "0 F"}
                    </span>
                  </div>
                  <div className="border-t border-[#D4AF37] pt-2 flex justify-between">
                    <span className="font-playfair font-bold text-[#6B3E26]">Total</span>
                    <span className="font-playfair font-bold text-[#F58220] text-xl">
                      {order.total.toLocaleString()} F
                    </span>
                  </div>
                </div>
              </div>

              {/* Historique */}
              <div className="bg-white border-2 border-[#D4AF37] rounded-lg p-6">
                <h3 className="font-playfair font-bold text-[#6B3E26] text-lg mb-4">
                  Historique des statuts
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#F58220]"></div>
                      <div className="w-0.5 h-12 bg-[#D4AF37]"></div>
                    </div>
                    <div className="pb-4">
                      <StatusBadge status={order.status} size="sm" />
                      <p className="text-xs text-[#999999] font-lato mt-2">
                        {new Date(order.createdAt).toLocaleString("fr-FR")}
                      </p>
                      <p className="text-sm font-lato text-[#6B3E26] mt-1">
                        Commande créée
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar (40%) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Actions Rapides */}
              <div className="bg-[#F5F5F5] rounded-lg p-6 border-2 border-[#D4AF37]">
                <h3 className="font-playfair font-bold text-[#6B3E26] text-lg mb-4">
                  Actions
                </h3>

                <div className="space-y-3">
                  {actions.length > 0 ? (
                    actions.map((newStatus) => (
                      <button
                        key={newStatus}
                        onClick={() => handleStatusAction(newStatus)}
                        disabled={loadingAction === newStatus}
                        className="w-full px-4 py-2 bg-[#F58220] hover:bg-[#E06E10] text-white rounded-lg font-lato font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loadingAction === newStatus ? (
                          <>
                            <span className="inline-block animate-spin">⟳</span>
                            Traitement...
                          </>
                        ) : (
                          getActionLabel(newStatus)
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-[#999999] font-lato text-center py-4">
                      Aucune action disponible
                    </p>
                  )}
                </div>
              </div>

              {/* Notes Internes */}
              <div className="bg-white border-2 border-[#D4AF37] rounded-lg p-6">
                <h3 className="font-playfair font-bold text-[#6B3E26] mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Notes internes
                </h3>

                <div className="space-y-3 mb-4">
                  {notes.length > 0 ? (
                    notes.map((note, idx) => (
                      <div key={idx} className="bg-[#FFF8E7] border border-[#F58220] rounded p-3">
                        <p className="text-sm font-lato text-[#6B3E26]">{note.text}</p>
                        <p className="text-xs text-[#999999] font-lato mt-2">
                          {note.author} • {note.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#999999] font-lato text-center py-3">
                      Aucune note
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t border-[#D4AF37] pt-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Ajouter une note interne..."
                    className="w-full px-3 py-2 border border-[#D4AF37] rounded-lg text-sm font-lato focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FED7AA] resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddNote}
                    className="w-full px-4 py-2 bg-[#F58220] hover:bg-[#E06E10] text-white rounded-lg font-lato font-semibold transition-colors text-sm"
                  >
                    Ajouter note
                  </button>
                </div>
              </div>

              {/* Actions de partage */}
              <div className="bg-white border-2 border-[#D4AF37] rounded-lg p-6">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#F58220]/10 hover:bg-[#F58220]/20 text-[#F58220] rounded-lg font-lato font-semibold transition-colors text-sm">
                  <Printer size={18} />
                  Imprimer reçu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
