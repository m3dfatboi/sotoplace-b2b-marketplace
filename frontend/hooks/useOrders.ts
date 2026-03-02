import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mockOrders } from "@/lib/mock-data";
import { Order } from "@/types";

interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export function useOrders(page = 1, size = 20) {
  return useQuery({
    queryKey: ["orders", page, size],
    queryFn: async () => {
      // Use mock data for now
      return {
        items: mockOrders,
        total: mockOrders.length,
        page: 1,
        size: mockOrders.length,
        pages: 1,
      };

      // Real API call (commented out for now)
      // const { data } = await api.get<OrdersResponse>("/orders", {
      //   params: { skip: (page - 1) * size, limit: size },
      // });
      // return data;
    },
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
