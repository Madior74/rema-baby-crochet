import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { adminGuard } from '../../core/guard/admin.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: ':id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductForm),
  },
];
