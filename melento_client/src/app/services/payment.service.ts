import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/addPaymentMode';

  constructor(private http: HttpClient) { }

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }
}
