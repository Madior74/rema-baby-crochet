import { Component, inject, input } from '@angular/core';
import { StatusBadge } from "../status-badge/status-badge";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../features/products/models/Product.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [StatusBadge, RouterLink, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private readonly cart = inject(CartService);
  readonly product = input.required<Product>();
  private readonly notifications = inject(NotificationService);

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation(); // empêche la navigation vers le détail

    const p = this.product();
    if (p.stockQuantity === 0) return;

    this.cart.addToCart(p);
    this.notifications.showSuccess(`« ${p.name} » ajouté au panier`);
  }
}
  