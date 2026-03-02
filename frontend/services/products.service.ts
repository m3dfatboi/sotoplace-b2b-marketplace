import { api } from "@/lib/api";
import { Product } from "@/types";

export interface ProductsListParams {
  skip?: number;
  limit?: number;
  status?: string;
  search?: string;
  category?: string;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  price: number;
  description?: string;
  specifications?: Record<string, any>;
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  category?: string;
  price?: number;
  description?: string;
  specifications?: Record<string, any>;
  status?: Product["status"];
}

export const productsService = {
  async getProducts(params: ProductsListParams = {}): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>("/products", { params });
    return data;
  },

  async getProduct(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const { data } = await api.post<Product>("/products", productData);
    return data;
  },

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}`, productData);
    return data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async publishProduct(id: number): Promise<Product> {
    const { data } = await api.post<Product>(`/products/${id}/publish`);
    return data;
  },
};
