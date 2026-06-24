import { axiosInstance } from './axios-instance'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  stockCount: number
}

export interface ProductRequest {
  name: string
  price: number
  category: string
  stockCount: number
}

export interface ValidationProblem {
  title: string
  errors: Record<string, string[]>
}

export const productsApi = {
  list: (): Promise<Product[]> =>
    axiosInstance.get<Product[]>('/api/products').then((r) => r.data),

  get: (id: string): Promise<Product> =>
    axiosInstance.get<Product>(`/api/products/${id}`).then((r) => r.data),

  create: (data: ProductRequest): Promise<Product> =>
    axiosInstance.post<Product>('/api/products', data).then((r) => r.data),

  update: (id: string, data: ProductRequest): Promise<Product> =>
    axiosInstance.put<Product>(`/api/products/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    axiosInstance.delete(`/api/products/${id}`).then(() => undefined),
}
