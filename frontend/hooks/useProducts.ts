import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService, CreateProductRequest, UpdateProductRequest } from "@/services";

export function useProducts(page = 1, size = 20, filters?: {
  status?: string;
  search?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: ["products", page, size, filters],
    queryFn: async () => {
      return await productsService.getProducts({
        skip: (page - 1) * size,
        limit: size,
        ...filters,
      });
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductRequest) =>
      productsService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productsService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function usePublishProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.publishProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}
