import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, CreateOrderRequest, UpdateOrderRequest } from "@/services";
import { mockOrders } from "@/lib/mock-data";

const USE_MOCK_DATA = true; // Toggle this to switch between mock and real API

export function useOrders(page = 1, size = 20) {
  return useQuery({
    queryKey: ["orders", page, size],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Use mock data
        return {
          items: mockOrders,
          total: mockOrders.length,
          page: 1,
          size: mockOrders.length,
          pages: 1,
        };
      }

      // Real API call
      return await ordersService.getOrders({
        skip: (page - 1) * size,
        limit: size,
      });
    },
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const order = mockOrders.find(o => o.id === id);
        if (!order) throw new Error("Order not found");
        return order;
      }

      return await ordersService.getOrder(id);
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => ordersService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderRequest }) =>
      ordersService.updateOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
