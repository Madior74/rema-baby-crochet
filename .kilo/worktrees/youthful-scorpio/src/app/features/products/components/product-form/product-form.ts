import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductStatus } from '../../../../features/products/models/ProductStatus.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ProductCreateRequest } from '../../dto/ProductCreateRequest.dto';
import { CategoryService } from '../../../../core/services/category.service';
import { CategoryResponse } from '../../../categories/dto/categoryResponse';
import { AGE_RANGES, MATERIALS, prettyMaterial } from '../../models/Product.model';

declare global {
  interface Window {
    cloudinary: any;
  }
}
@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categorieService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  protected prettyMaterial = prettyMaterial;
  
  readonly productId = signal<string | null>(null);
  readonly isEditMode = signal(false);
  readonly submitting = signal(false);
  readonly categories = signal<CategoryResponse[]>([]);

  //Signal pour l'URL de l'image uploadé
  readonly uploadedImageUrl = signal<string | null>(null);
  readonly statuses: ProductStatus[] = ['ACTIVE', 'INACTIVE'];

  private cloudinaryWidget: any = null;

  ageRanges = AGE_RANGES;
  materials = MATERIALS;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    material: [MATERIALS[1] as (typeof MATERIALS)[number], Validators.required],
    status: ['ACTIVE' as ProductStatus, Validators.required],
    categoryId: [1, Validators.required],
    ageRange: ['0-3 MOIS', Validators.required],
  });

  // Effet pour synchroniser l'URL uploadée avec le formulaire
  private syncImageUrl = effect(() => {
    const url = this.uploadedImageUrl();
    if (url) {
      this.form.patchValue({ imageUrl: url });
    }
  });

  ngOnDestroy(): void {
    this.destroyWidget();
  }

  private destroyWidget(): void {
    if (this.cloudinaryWidget) {
      try {
        this.cloudinaryWidget.close();
        this.cloudinaryWidget.destroy?.();
      } catch {
        // Ignorer les erreurs de nettoyage
      }
      this.cloudinaryWidget = null;
    }
  }

  ngOnInit(): void {
    //chargement des catégories
    this.categorieService.findAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: () => {
        this.notifications.showError('Erreur lors du chargement des catégories');
      },
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId.set(id);
      this.isEditMode.set(true);
      this.productService.getById(id).subscribe((product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          stockQuantity: product.stockQuantity,
          ageRange: product.ageRange,
          imageUrl: product.imageUrl ?? '',
          status: product.status,
          categoryId: product.category.id,
          material: product.material,
        });
        //chargement de l'image existente
        if (product.imageUrl) {
          this.uploadedImageUrl.set(product.imageUrl);
        }
      });
    }
  }

  // Initialiser le widget Cloudinary
  initCloudinaryWidget(): void {
    if (!window.cloudinary?.createUploadWidget) {
      this.notifications.showError("Le service d'upload n'est pas disponible. Rechargez la page.");
      return;
    }

    try {
      this.cloudinaryWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: environment.cloudinary.cloudName,
          uploadPreset: environment.cloudinary.uploadPreset,
          sources: ['local', 'url', 'camera'],
          maxFileSize: 5000000,
          maxImageFileSize: 5000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          multiple: false,
          defaultSource: 'local',
          folder: 'rema-baby/products',
          tags: ['rema-baby', 'product'],
          cropping: false,
          showSkipCropButton: false,
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Erreur upload Cloudinary:', error);
            this.notifications.showError("Erreur lors de l'upload de l'image");
            return;
          }

          if (result && result.event === 'success') {
            const info = result.info;
            const secureUrl = info.secure_url;
            const publicId = info.public_id;

            console.log('Upload réussi:', { secureUrl, publicId });

            // Mettre à jour le signal avec l'URL
            this.uploadedImageUrl.set(secureUrl);
            this.notifications.showSuccess('Image uploadée avec succès');
          }
        },
      );
    } catch (err) {
      console.error('Erreur création widget Cloudinary:', err);
      this.notifications.showError("Erreur lors de l'initialisation de l'upload");
    }
  }

  openUploadWidget(): void {
    if (!this.cloudinaryWidget) {
      this.initCloudinaryWidget();
    }
    this.cloudinaryWidget?.open();
  }

  submit(): void {
    // if(this.categories.length === 0){
    //   this.notifications.showError("Aucune catégorie disponible. Veuillez créer une catégorie avant de créer un produit.");
    //   return;
    // }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload: ProductCreateRequest = this.form.getRawValue();
    const id = this.productId();

    const request$ =
      this.isEditMode() && id
        ? this.productService.update(id, payload)
        : this.productService.create(payload);

    request$.subscribe({
      next: (product) => {
        this.notifications.showSuccess(this.isEditMode() ? 'Produit mis à jour' : 'Produit créé');
        this.router.navigate(['/products', product.id]);
      },
      error: () => this.submitting.set(false),
    });
  }
}
