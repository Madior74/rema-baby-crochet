import { ProductStatus } from '../models/ProductStatus.model';

export interface ProductSearchParams {
  name?: string;
  categoryId?: number;
  ageRange?: string;
  material?: string;
  status?: ProductStatus;
  page?: number;
  size?: number;
}
