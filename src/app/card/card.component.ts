import {Component, Input} from '@angular/core';
import Product from "../model";
import {ProductService} from "../service/product.service";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() product!: Product;

  quantity: number = 0;

  constructor(private productService: ProductService) {}

  addToCart(): void {
    if (this.quantity > 0) {
      this.productService.addToCart({...this.product, quantity: this.quantity});
    }
  }

  increaseQuantity(): void {
    this.quantity++;
    this.addToCart();

  }

  decreaseQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

}
