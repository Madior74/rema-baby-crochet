import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime, distinct, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCard } from '../product-card/product-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AGE_RANGES, MATERIALS, Product } from '../../../../features/products/models/Product.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../categories/models/Category.model';
import { EMPTY_PRODUCT_FILTER, ProductFilterValues } from '../../models/ProductFilterValues.model';
import { ProductFilter } from "../product-filter/product-filter";

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, CommonModule, ReactiveFormsModule, RouterLink, ProductFilter],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  readonly auth = inject(AuthService);

  //recherche par nom
  readonly searchControl = new FormControl('', { nonNullable: true });
  //filtre par statut
  readonly statusControl = new FormControl<string | null>(null);
  // Tranches prédéfinies pour un clic rapide

  //signaux
  readonly categories = signal<Category[]>([]);
  readonly activeFilters=signal<ProductFilterValues>(EMPTY_PRODUCT_FILTER);
  readonly products = signal<Product[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isEmpty = computed(() => !this.loading() && this.products().length === 0);

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadProducts();
      });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
 


  }

  onFilterChange(filters: ProductFilterValues): void {
    this.activeFilters.set(filters);
    this.currentPage.set(0);
    this.loadProducts();
    console.log('[ProductList] onFilterChange', filters);
  }


  loadCategories(): void {
  this.categoryService.findAll().subscribe({
    next: (cats) => this.categories.set(cats),
    error: () => console.error('Impossible de charger les catégories'),
  });
}



  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    const filters=this.activeFilters();
      console.log('[ProductList] loadProducts filters', filters);
    this.productService
      .search({
        name: this.searchControl.value || undefined,
        categoryId:filters.categoryId ?? undefined,
        ageRange:filters.ageRange ?? undefined,
        material:filters.material ?? undefined,
        page: this.currentPage(),
        size: 12,
      })
      .subscribe({
        next: (page) => {
          this.products.set(page.content);
          this.totalPages.set(page.totalPages);
          this.loading.set(false);
        },

        error: () => {
          this.errorMessage.set('Impossible de charger les produits');
          this.loading.set(false);
        },
      });
  }


  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }
}
