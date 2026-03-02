export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  company_id?: number;
}

export interface Company {
  id: number;
  name: string;
  inn: string;
  type: "manufacturer" | "buyer" | "contractor";
  status: "active" | "inactive" | "pending";
}

export interface Order {
  id: number;
  order_number: string;
  company_id: number;
  company_name?: string;
  buyer_company_id: number;
  buyer_company_name?: string;
  status: "draft" | "new" | "in_progress" | "production" | "ready" | "shipped" | "delivered" | "completed" | "cancelled";
  total_amount: number;
  created_at: string;
  updated_at: string;
  deadline?: string;
  manager_id?: number;
  constructor_id?: number;
  items_count?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  company_id: number;
  status: "draft" | "active" | "inactive";
}

export interface DashboardStats {
  active_orders: number;
  total_revenue: number;
  pending_tasks: number;
  weekly_sales: number[];
}
