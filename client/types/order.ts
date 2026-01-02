export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "in_preparation" | "ready" | "out_for_delivery" | "completed" | "cancelled";
  deliveryType: "delivery" | "pickup";
  paymentMethod?: "wave" | "orange_money" | "cash";
  paymentStatus?: "pending" | "completed" | "failed";
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  completedAt?: string;
}
