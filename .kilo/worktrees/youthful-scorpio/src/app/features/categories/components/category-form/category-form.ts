import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly isEditMode = signal(false);
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    slug: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoryService.getById(Number(id)).subscribe({
        next: (category) => {
          this.form.patchValue({
            name: category.name,
            slug: category.slug,
          });
        },
        error: () => {
          this.notifications.showError('Erreur lors du chargement de la catégorie');
          this.router.navigate(['/categories']);
        },
      });
    }

    // Auto-génération du slug à partir du nom
    this.form.controls.name.valueChanges.subscribe((name) => {
      if (!this.isEditMode()) {
        const slug = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        this.form.controls.slug.setValue(slug);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue();
    const id = this.route.snapshot.paramMap.get('id');

    const request$ = id
      ? this.categoryService.update(Number(id), payload)
      : this.categoryService.create(payload);

    request$.subscribe({
      next: () => {
        this.notifications.showSuccess(
          id ? 'Catégorie mise à jour' : 'Catégorie créée avec succès',
        );
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.submitting.set(false);
        this.notifications.showError("Erreur lors de l'enregistrement");
      },
    });
  }
}