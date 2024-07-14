import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private purchasesUrl = 'http://localhost:3000/purchases';

  constructor(private http: HttpClient) {}

  getAssessments(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.purchasesUrl);
  }
  updatePurchase(purchase: Purchase): Observable<Purchase> {
    const url = `${this.purchasesUrl}`; // Adjust URL according to your API
    return this.http.put<Purchase>(url, purchase);
  }
}
