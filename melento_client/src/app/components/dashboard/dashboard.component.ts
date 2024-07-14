import { Component, OnInit } from '@angular/core';
import { CartItem, Product } from '../../models/add-assessment';
import { CheckoutServiceService } from '../../services/checkout-service.service';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { ProductService } from '../../services/add-assessment.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userId: any;
  userRole: any;
  assessments: PurchaseItem[] = [];
  arrAssessment: Product[] = [];
  attemptedAssessments: string[] = [];
  isDashboardEmpty: boolean = false;
  isFaculty: boolean = false;
  assessmentIds: string[] = [];
  userPurchases: any[] = [];
  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService,
    private productService: ProductService
  ) {
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
  }

  ngOnInit(): void {
    if (this.userRole) {
      this.isFaculty = true;
    }
    this.loadUserAssessments();
  }

  loadUserAssessments(): void {
    this.assessmentService.getAssessments().subscribe(
      (purchases: Purchase[]) => {
        this.userPurchases = purchases.filter(
          (purchase) => purchase.userId === this.userId
        );
        this.userPurchases.forEach((purchase) => {
          purchase.items.forEach(
            (item: { quantity: number; assessmentId: string }) => {
              if (item.quantity > 0) {
                this.assessmentIds.push(item.assessmentId);
              }
            }
          );
        });
        console.log('User Purchases: ', this.userPurchases);
        if (this.userPurchases.length === 0) {
          this.isDashboardEmpty = true;
        }
        this.filterAssessments();
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }

  filterAssessments(): void {
    this.productService.getProducts().subscribe((data) => {
      const allAssessments = data;
      const filteredAssessments = allAssessments.filter((assessment) =>
        this.assessmentIds.includes(assessment.id)
      );
      this.arrAssessment = filteredAssessments;
      console.log(this.arrAssessment);
    });
  }
  getAssessmentQuantity(assessmentId: string): number {
    if (this.userPurchases.length > 0 && this.userPurchases[0].items) {
      const foundItem = this.userPurchases[0].items.find(
        (item: { assessmentId: string }) => item.assessmentId === assessmentId
      );
      return foundItem ? foundItem.quantity : 0;
    }
    return 0;
  }
}
