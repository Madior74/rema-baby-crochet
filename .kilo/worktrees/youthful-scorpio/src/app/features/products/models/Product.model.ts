import { Category } from '../../categories/models/Category.model';
import { ProductStatus } from './ProductStatus.model';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  ageRange?: typeof AGE_RANGES[number];
  material: typeof MATERIALS[number];
  stockQuantity: number;
  imageUrl: string | null;
  status: ProductStatus;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export const MATERIALS = ['LAINE COTON', 'LAINE CLASSIQUE'] as const;
export const AGE_RANGES = ['0-3 MOIS', '4-6 MOIS', '7-10 MOIS', '1-2 ANS', '3-5 ANS'] as const;
export function prettyMaterial(material: string): string {
  return (material || '').toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}