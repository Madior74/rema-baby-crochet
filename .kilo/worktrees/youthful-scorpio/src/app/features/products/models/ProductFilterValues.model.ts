export interface ProductFilterValues {
  categoryId: number | null;
  ageRange: string | null;
  material: string | null;
}

export const EMPTY_PRODUCT_FILTER: ProductFilterValues = {
  categoryId: null,
  ageRange: null,
  material: null,
};
