import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "../../features/Cart/model/CartItem.model";
import { Product } from "../../features/products/models/Product.model";


@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<CartItem[]>([]);
  readonly isCarDrawerOpen = signal<boolean>(false);
  private readonly STORAGE_KEY = 'mareme_diop';

  //Exposé en lecture seule
  readonly cartItems = this.items.asReadonly();

  //Nombre total d'articles somme des quantites
  readonly itemCount= computed(()=>{
    return this.items().reduce((total,item)=>total+item.quantity,0)
  })
  //Montant total
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  //constructeur
  constructor() {
    //récuperation des donnees au démarrage
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.items.set(parsed);
      } catch {
        //sil ya erreur
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
    // sauvegarde automatique dans localStorage
    effect(() => {
      const data = JSON.stringify(this.items());
      localStorage.setItem(this.STORAGE_KEY, data);
    });
  }

  //addToCart
  addToCart(product: Product, quantity = 1): void {
    if (product.stockQuantity === 0) return;

    this.items.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);

      if (existing) {
        return current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }

      return [...current, { product, quantity }];
    });
  }

  //remove from cart
  removeFromCart(productId: string): void {
    this.items.update((current) => current.filter((i) => i.product.id !== productId));
  }

  //clear Cart
  clearCart(): void {
    this.items.set([]);
  }

  //open cartDrawe
  openCartDrawer(): void {
    this.isCarDrawerOpen.set(true);
  }

  //close
  closeDrawerOpen(): void {
    this.isCarDrawerOpen.set(false);
  }

  //toggle
  toggleCartDrawer(): void {
    this.isCarDrawerOpen.update((v) => !v);
  }

  //update
  updateQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    this.items.update((items) =>
      items.map((item) =>
        item.product.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.product.price }
          : item,
      ),
    );
  } 
}