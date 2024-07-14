import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../../services/add-assessment.service';
import { Product } from '../../models/add-assessment';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
@Component({
  selector: 'app-view-assessment-details',
  templateUrl: './view-assessment-details.component.html',
  styleUrls: ['./view-assessment-details.component.scss'],
})
export class ViewAssessmentDetailsComponent implements OnInit {
  assessment: Product = new Product('', '', '', '', 0, '', true, 0, 0, '', []);
  assessments: Product[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const assessmentId = params['id'];
      this.loadAssessmentDetails(assessmentId);
      const query = params['query'];
      if (query) {
        this.searchAssessment(query);
      }
    });
  }
  searchAssessment(query: string): void {
    this.productService.getProducts().subscribe(
      (assessments: Product[]) => {
        this.assessments = assessments;
        const assessment = assessments.find(
          (a) =>
            a.id === query ||
            a.aName.toLowerCase().includes(query.toLowerCase())
        );
        if (assessment) {
          this.assessment = assessment;
        } else {
          console.error('Assessment not found');
        }
      },
      (error: any) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }
  loadAssessmentDetails(id: string): void {
    this.productService.getProductById(id).subscribe(
      (assessment: Product) => {
        console.log('Fetched Assessment:', assessment);
        this.assessment = assessment;
      },
      (error: any) => {
        console.error('Error fetching assessment:', error);
      }
    );
  }
  displayCartDetails(product: Product) {
    const role = this.localStorageService.getItem('role');
    if (role === null) {
      alert('Please login to add items to the cart.');
      return;
    }
    this.cartService.addToCart(product);
    alert(`Assessment ${product.aName} added to cart successfully!`);
  }
}
