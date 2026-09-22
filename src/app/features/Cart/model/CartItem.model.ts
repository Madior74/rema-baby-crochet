import { Product } from "../../products/models/Product.model";

export interface CartItem{
    product:Product;
    quantity:number;
}