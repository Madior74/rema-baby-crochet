import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../features/categories/models/Category.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { CategoryResponse } from '../../dto/categoryResponse';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from '../../../products/components/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, CommonModule, ConfirmDialog],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly selectedCategory = signal<CategoryResponse | null>(null);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly showDeleteConfirm = signal(false);
  readonly auth = inject(AuthService);

  ngOnInit(): void {
   this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => {
        this.notifications.showError('Erreur lors du chargement des catégories');
      },
    });
  }

  confirmDelete(): void {
    const categ = this.selectedCategory();

    if (!categ) return;

    this.categoryService.delete(categ.id).subscribe({
      next: () => {
        this.notifications.showSuccess('Catégorie supprimée');

        this.categories.update((categories) =>
          categories.filter((category) => category.id !== categ.id),
        );

        this.selectedCategory.set(null);
      },

      error: () => {
        this.notifications.showError('Erreur lors de la suppression de la catégorie');
      },
    });
  }
}
