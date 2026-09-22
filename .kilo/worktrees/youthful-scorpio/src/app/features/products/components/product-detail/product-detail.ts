import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialog } from "../confirm-dialog/confirm-dialog";
import { StatusBadge } from "../status-badge/status-badge";
import { CommonModule } from '@angular/common';
import { Product } from '../../../../features/products/models/Product.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [ConfirmDialog, StatusBadge,RouterLink,CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit{
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly cart = inject(CartService);
  

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly showDeleteConfirm = signal(false);
  readonly auth = inject(AuthService);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(): void {
    const product = this.product();
    if (!product) return;

    this.productService.delete(product.id).subscribe(() => {
      this.notifications.showSuccess('Produit supprimé');
      this.router.navigate(['/products']);
    });
  }


  addTocart():void{
    const p=this.product();
    if(!p || p.stockQuantity ===0)return;

    this.cart.addToCart(p);
    this.notifications.showSuccess(`<<${p.name}>> ajouté au panier`)
  }

}
