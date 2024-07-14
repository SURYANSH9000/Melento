import { Injectable, EventEmitter } from '@angular/core';
import { CartItem } from '../models/add-assessment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CheckoutServiceService {
  checkoutEvent = new EventEmitter<CartItem[]>();
  private purchasesUrl = 'http://localhost:3000/purchases';

  constructor(private http: HttpClient) {}

  checkout(purchaseDetails: Purchase): Observable<any> {
    return this.http.post<any>(this.purchasesUrl, purchaseDetails);
  }

  updatePurchase(purchaseDetails: Purchase): Observable<any> {
    return this.http.put<any>(`${this.purchasesUrl}`, purchaseDetails);
  }

  emitCheckoutEvent(cartItems: CartItem[]) {
    this.checkoutEvent.emit(cartItems);
  }
}
