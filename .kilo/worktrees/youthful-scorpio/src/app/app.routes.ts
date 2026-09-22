import { Routes } from '@angular/router';
import { CategoryList } from './features/categories/components/category-list/category-list';
import { CategoryForm } from './features/categories/components/category-form/category-form';
import { Hero } from './features/hero/hero';
import { SurMesure } from './features/sur-mesure/sur-mesure';
import { adminGuard } from './core/guard/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'hero',
    pathMatch: 'full',
  },
  {
    path: 'hero',
    component: Hero,
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/product.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'categories',
    children: [
      {
        path: '',
        component: CategoryList,
      },
      {
        path: 'create',
        canActivate: [adminGuard],
        component: CategoryForm,
      },
      {
        path: 'edit/:id',
        canActivate: [adminGuard],
        component: CategoryForm,
      },
    ],
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/Cart/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'sur-mesure',
    loadComponent: () => import('./features/sur-mesure/sur-mesure').then((m) => m.SurMesure),
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./features/a-propos/a-propos').then((m) => m.APropos),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },

  {
    path: '**',
    redirectTo: 'hero',
  },
];
