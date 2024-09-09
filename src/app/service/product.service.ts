import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Product from '../model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'assets/data.json';
  private cartSubject = new BehaviorSubject<Product[]>([]);
  cart$ = this.cartSubject.asObservable();
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchAllProducts();
  }

  fetchAllProducts(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      tap(() => console.log('Fetching all products')),
      catchError(this.handleError)
    ).subscribe(products => this.productsSubject.next(products));
  }

  fetchProductsByCategory(category: string): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.filter(product => product.category === category)),
      catchError(this.handleError)
    ).subscribe(filteredProducts => this.productsSubject.next(filteredProducts));
  }

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    const existingProduct = currentCart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      this.cartSubject.next([...currentCart]);
    } else {
      this.cartSubject.next([...currentCart, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(product => product.id !== productId);
    this.cartSubject.next(updatedCart);
  }

  increaseQuantity(productId: number): void {
    const currentCart = this.cartSubject.value;
    const product = currentCart.find(item => item.id === productId);

    if (product) {
      product.quantity = (product.quantity || 1) + 1;
      this.cartSubject.next([...currentCart]);
    }
  }

  decreaseQuantity(productId: number): void {
    const currentCart = this.cartSubject.value;
    const product = currentCart.find(item => item.id === productId);

    if (product) {
      if (product.quantity && product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.removeFromCart(productId); // Remove product if quantity is 1
      }
      this.cartSubject.next([...currentCart]);
    }
  }

  getCartTotalQuantity(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart.reduce((total, product) => total + (product.quantity || 0), 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cart$.pipe(
      map(products => products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error.message);
    return throwError(() => new Error('Something went wrong'));
  }
}
