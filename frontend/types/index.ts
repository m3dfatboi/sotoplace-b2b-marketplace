// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

// Company types
export enum CompanyRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONSTRUCTOR = 'constructor',
  CLIENT = 'client',
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  inn?: string;
  website?: string;
  logo?: string;
  created_at: string;
}

export interface CompanyMember {
  user_id: string;
  company_id: string;
  role: CompanyRole;
  user?: User;
}

// Order types
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
  manager_id?: string;
  constructor_id?: string;
  created_at: string;
  updated_at: string;
  buyer_company?: Company;
  supplier_company?: Company;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  specifications?: Record<string, any>;
}

// Product types
export interface Product {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  category?: string;
  base_price: number;
  is_published: boolean;
  images?: string[];
  specifications?: Record<string, any>;
  created_at: string;
  company?: Company;
}

// Analytics types
export interface DashboardStats {
  total_orders: number;
  active_orders: number;
  total_revenue: number;
  revenue_growth: number;
  total_products: number;
  published_products: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
}
