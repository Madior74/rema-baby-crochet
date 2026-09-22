import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  readonly cartService = inject(CartService);
  constructor(private router: Router) {}

  //incrémenter
  increment(itemId: string, currentQty: number): void {
    this.cartService.updateQuantity(itemId, currentQty + 1);
  }
  decrement(itemId: string, currentQty: number): void {
    this.cartService.updateQuantity(itemId, currentQty - 1);
  }

  // envoyer le panier vers WhatsApp
  sendToWhatsApp() {
    const items = this.cartService.cartItems();
    if (items.length === 0) return;

    const formatFcfa = (n: number) => n.toLocaleString('fr-FR');

    let message = '🧶 *Nouvelle commande Rema Baby Crochet*\n';
    message += '━━━━━━━━━━━━━━━━━━━━━\n\n';

    items.forEach((item, index) => {
      const sousTotal = item.product.price * item.quantity;
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Qté : ${item.quantity} × ${formatFcfa(item.product.price)} = *${formatFcfa(sousTotal)} FCFA*\n\n`;
    });

    message += '━━━━━━━━━━━━━━━━━━━━━\n';
    message += `Total articles : ${this.cartService.itemCount()}\n`;
    message += `*Somme Total : ${formatFcfa(this.cartService.totalPrice())} FCFA*`;

    const encoded = encodeURIComponent(message);
    const phone = '221773908881'; // sans le "+"
    const url = `https://wa.me/${phone}?text=${encoded}`;

    window.open(url, '_blank');
  }

  // retour
  retourProducts(): void {
    this.router.navigate(['/products']);
  }
}
