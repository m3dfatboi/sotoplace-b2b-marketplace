// API Response types
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  inn?: string;
  created_at: string;
}

export enum OrderStatus {
  DRAFT = 'draft',
  NEGOTIATION = 'negotiation',
  APPROVED = 'approved',
  IN_PRODUCTION = 'in_production',
  READY = 'ready',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  order_number: string;
  buyer_company_id: string;
  supplier_company_id: string;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  buyer_company?: Company;
  supplier_company?: Company;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  category?: string;
  base_price: number;
  is_published: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_orders: number;
  active_orders: number;
  total_revenue: number;
  total_products: number;
}
