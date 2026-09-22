import { ProductStatus } from "../models/ProductStatus.model";

export interface ProductCreateRequest {
  name: string;
  description: string | null;
  price: number;
 ageRange: string;
 material: string;
  stockQuantity: number;
  imageUrl: string | null;
  status: ProductStatus;
  categoryId: number;
}
export type ProductUpdateRequest = ProductCreateRequest;

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; 
  size: number;
}

