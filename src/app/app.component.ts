import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from "./card/card.component";
import Product from "./model";
import { ProductService } from "./service/product.service";
import { Observable } from "rxjs";
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardComponent, NgIf, AsyncPipe, NgForOf, CurrencyPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shoppingCart';

  products$!: Observable<Product[]>;
  cart$!: Observable<Product[]>;
  cartTotalQuantity$!: Observable<number>;
  cartTotal$!: Observable<number>;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.products$;
    this.cart$ = this.productService.cart$;
    this.cartTotal$ = this.productService.getCartTotal();
    this.cartTotalQuantity$ = this.productService.getCartTotalQuantity();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(category?: string): void {
    if (category) {
      this.productService.fetchProductsByCategory(category);
    } else {
      this.productService.fetchAllProducts();
    }
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
  }

  increaseQuantity(productId: number): void {
    this.productService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    this.productService.decreaseQuantity(productId);
  }
}
