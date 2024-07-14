import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/add-assessment';
import { CheckoutServiceService } from '../../services/checkout-service.service';
import { HttpClient } from '@angular/common/http';
import { Purchase, PurchaseItem } from '../../models/cart';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface CartItem {
  item: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CurrencyPipe],
})
export class CartComponent implements OnInit {
  isLoggIn: boolean = false;
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;
  userId: any;
  purchasesUrl: string = 'http://localhost:3000/purchases';
  couponCode: string = '';
  isCouponApplied: boolean = false;
  paymentService: any;
  constructor(
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private checkoutService: CheckoutServiceService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.checkLogin();
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotals();
    this.userId = this.localStorageService.getItem('userId');
  }

  checkLogin() {
    const role = this.localStorageService.getItem('role');
    this.isLoggIn = role !== null;
  }

  increaseQuantity(item: Product) {
    this.cartService.increaseQuantity(item);
    this.cartItems = this.cartService.getCartItems();
    console.log(this.cartItems);
    this.calculateTotals();
  }

  decreaseQuantity(item: Product) {
    this.cartService.decreaseQuantity(item);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotals();
  }

  calculateTotals() {
    this.calculateTotalAmount();
    this.calculateTotalQuantity();
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, cartItem) => {
      return total + cartItem.item.aPrice * cartItem.quantity;
    }, 0);
  }

  calculateTotalQuantity() {
    this.totalQuantity = this.cartItems.reduce((total, cartItem) => {
      return total + cartItem.quantity;
    }, 0);
  }
  generateUniqueId(items: { id: string }[]): string {
    if (items.length === 0) {
      return '1';
    }

    const maxId = Math.max(...items.map((item) => parseInt(item.id)));
    return String(maxId + 1);
  }
  applyCoupon(): void {
    if (this.couponCode) {
      console.log(`Applying coupon code: ${this.couponCode}`);

      if (this.couponCode === 'DISCOUNT10') {
        const discount = this.totalAmount * 0.1;
        this.totalAmount -= discount;
        this.showSuccess(
          `Coupon applied 🎉! Discount: ₹ ${discount.toFixed(2)}`
        );
        this.isCouponApplied = true;
      } else {
        this.showError('Invalid coupon code.');
      }

      this.couponCode = '';
    } else {
      this.showError('Please enter a coupon code.');
    }
  }
  showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
  showError(message: string) {
    this.toastr.error(message, 'Error', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
  async checkout() {
    this.checkoutService.emitCheckoutEvent(this.cartItems);
    console.log(this.cartItems);

    try {
      const existingPurchases = await this.http
        .get<Purchase[]>(this.purchasesUrl)
        .toPromise();
      console.log(this.cartItems);

      if (existingPurchases) {
        const existingPurchase = existingPurchases.find(
          (purchase) => purchase.userId === this.userId
        );
        console.log(existingPurchase);

        if (existingPurchase) {
          console.log('Hello');
          existingPurchase.items.forEach((existingItem: PurchaseItem) => {
            const cartItem = this.cartItems.find(
              (item) => item.item.id === existingItem.assessmentId
            );
            if (cartItem) {
              existingItem.quantity += cartItem.quantity;
            }
          });

          this.cartItems.forEach((cartItem) => {
            if (
              !existingPurchase.items.find(
                (item) => item.assessmentId === cartItem.item.id
              )
            ) {
              existingPurchase.items.push({
                assessmentId: cartItem.item.id,
                quantity: cartItem.quantity,
              });
              console.log(existingPurchase);
            }
          });

          try {
            const response = await this.checkoutService
              .updatePurchase(existingPurchase)
              .toPromise();
            console.log(response);
            console.log('Purchase details updated successfully:', response);
            this.cartService.clearCart();
            this.cartItems = this.cartService.getCartItems();
            this.calculateTotals();
            console.log(this.totalAmount);
          } catch (error) {
            console.error('Error updating purchase details:', error);
          }
        } else {
          const newPurchaseId = this.generateUniqueId(existingPurchases);
          console.log(this.cartItems);
          const purchaseDetails: Purchase = {
            id: newPurchaseId,
            userId: this.userId,
            items: this.cartItems.map((item) => ({
              assessmentId: item.item.id,
              quantity: item.quantity,
            })),
          };

          try {
            const response = await this.checkoutService
              .checkout(purchaseDetails)
              .toPromise();
            console.log('Purchase details stored successfully:', response);
          } catch (error) {
            console.error('Error storing purchase details:', error);
          }
        }
      } else {
        console.error('Error: existingPurchases is undefined');
      }
    } catch (error) {
      console.error('Error fetching existing purchases:', error);
    }

    this.cartService.clearCart();
    this.cartItems = this.cartService.getCartItems();

    this.calculateTotals();
  }
}
