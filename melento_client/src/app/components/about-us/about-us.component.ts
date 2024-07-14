import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  payment: Payment = {
    paymentModeId: 0,
    paymentName: '',
    enabled: false
  };
  constructor(private paymentService: PaymentService) { }

  onSubmit(): void {
    this.paymentService.addPayment(this.payment).subscribe(
      response => {
        console.log('Payment mode added:', response);
      },
      error => {
        console.error('Error adding payment mode:', error);
      }
    );
  }
}

