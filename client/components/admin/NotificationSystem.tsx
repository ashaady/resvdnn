import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "urgent" | "info";
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  onNewNotification?: (notification: Notification) => void;
}

export default function NotificationSystem({
  onNewNotification,
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  // Function to add a notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Play notification sound
    playNotificationSound();

    // Show browser notification if permitted
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "https://cdn.builder.io/api/v1/image/assets%2F562ab4a0fd0a4cbdb2356bc1d15ae09f%2Fc57dc195ba544a7f8fb75b5b0c07efa7?format=webp&width=800",
      });
    }

    // Call parent callback
    if (onNewNotification) {
      onNewNotification(newNotification);
    }

    // Auto remove after 5 seconds if not urgent
    if (notification.type !== "urgent") {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Expose addNotification to window for external use
  useEffect(() => {
    (window as any).addNotification = addNotification;
  }, []);

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return "#F58220";
      case "urgent":
        return "#EF4444";
      case "info":
        return "#3B82F6";
      default:
        return "#999999";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return "📦";
      case "urgent":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 text-[#6B3E26] hover:bg-[#F5F5F5] rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showPanel && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-[#D4AF37]">
            <div className="sticky top-0 bg-gradient-to-r from-[#6B3E26] to-[#9C6B4A] text-white px-4 py-3 flex items-center justify-between border-b border-[#F58220]">
              <h3 className="font-playfair font-bold">Notifications</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2 p-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${
                      notif.read
                        ? "bg-[#F5F5F5] border-l-[#D4AF37]"
                        : "bg-[#FFF8E7] border-l-[#F58220]"
                    }`}
                    style={{
                      borderLeftColor: getTypeColor(notif.type),
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">
                        {getTypeIcon(notif.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-lato font-semibold text-[#6B3E26] text-sm">
                          {notif.title}
                        </p>
                        <p className="font-lato text-xs text-[#999999] mt-1">
                          {notif.message}
                        </p>
                        <p className="font-lato text-xs text-[#999999] mt-1">
                          {formatTime(notif.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="p-1 hover:bg-[#D4AF37]/20 rounded transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setNotifications([])}
                  className="w-full mt-4 py-2 text-sm font-lato text-[#999999] hover:text-[#F58220] border-t border-[#D4AF37] pt-4 transition-colors"
                >
                  Effacer tout
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-[#999999] opacity-30 mb-2" />
                <p className="text-sm text-[#999999] font-lato">
                  Aucune notification
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `il y a ${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  return `il y a ${Math.floor(diffHours / 24)}j`;
}
