import { ReactNode } from "react";

export type OrderAction =
  | "confirm"
  | "cancel"
  | "prepare"
  | "ready"
  | "deliver"
  | "pickup"
  | "complete";

interface ActionButtonProps {
  action: OrderAction;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const actionConfig: Record<
  OrderAction,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  confirm: {
    label: "✓ Confirmer",
    icon: "✓",
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
  cancel: {
    label: "✕ Annuler",
    icon: "✕",
    color: "#EF4444",
    bgColor: "#FEE2E2",
  },
  prepare: {
    label: "👨‍🍳 Préparer",
    icon: "👨‍🍳",
    color: "#F58220",
    bgColor: "#FED7AA",
  },
  ready: {
    label: "✓ Prête",
    icon: "✓",
    color: "#8B5CF6",
    bgColor: "#EDE9FE",
  },
  deliver: {
    label: "🚚 Livrer",
    icon: "🚚",
    color: "#3B82F6",
    bgColor: "#DBEAFE",
  },
  pickup: {
    label: "✓ Récupérée",
    icon: "✓",
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
  complete: {
    label: "✓ Livrée",
    icon: "✓",
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
};

export default function ActionButton({
  action,
  onClick,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  size = "md",
}: ActionButtonProps) {
  const config = actionConfig[action];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${sizeClasses[size]} font-lato font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
        fullWidth ? "w-full" : ""
      } ${
        disabled || isLoading
          ? "opacity-50 cursor-not-allowed"
          : `hover:shadow-lg active:scale-95`
      }`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `2px solid ${config.color}`,
      }}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin">⟳</span>
          Traitement...
        </>
      ) : (
        <>
          <span>{config.icon}</span>
          {config.label}
        </>
      )}
    </button>
  );
}
