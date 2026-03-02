import { api } from "@/lib/api";
import { Order } from "@/types";

export interface OrdersListParams {
  skip?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CreateOrderRequest {
  buyer_company_id: number;
  deadline?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  status?: Order["status"];
  deadline?: string;
  notes?: string;
  manager_id?: number;
  constructor_id?: number;
}

export const ordersService = {
  async getOrders(params: OrdersListParams = {}): Promise<OrdersResponse> {
    const { data } = await api.get<OrdersResponse>("/orders", { params });
    return data;
  },

  async getOrder(id: number): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const { data } = await api.post<Order>("/orders", orderData);
    return data;
  },

  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${id}`, orderData);
    return data;
  },

  async deleteOrder(id: number): Promise<void> {
    await api.delete(`/orders/${id}`);
  },

  async addOrderItem(orderId: number, itemData: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }): Promise<void> {
    await api.post(`/orders/${orderId}/items`, itemData);
  },
};
