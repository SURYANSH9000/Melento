import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { ProductService } from '../../../services/add-assessment.service';
import { Product } from '../../../models/add-assessment';

@Component({
  selector: 'app-liked-assessments',
  templateUrl: './liked-assessments.component.html',
  styleUrl: '../dashboard.component.scss',
})
export class LikedAssessmentsComponent implements OnInit {
  userId: any;
  likedAssessments: string[] = [];
  likedAssessmentsArr: any[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('userId');
    const likedAssArr = this.localStorageService.getItem('likedAssessment');
    console.log(likedAssArr);
    console.log(typeof likedAssArr);
    if (likedAssArr) {
      try {
        this.likedAssessments = JSON.parse(likedAssArr);
      } catch (error) {
        this.likedAssessments = likedAssArr.split(',');
      }
    } else {
      this.likedAssessments = [];
    }
    console.log(this.likedAssessments);
    this.loadUserAssessments();
  }
  loadUserAssessments(): void {
    this.productService.getProducts().subscribe(
      (purchases: Product[]) => {
        this.likedAssessmentsArr = purchases.filter((purchase) =>
          this.likedAssessments.includes(purchase.id)
        );
        console.log('Liked Assessment Array: ', this.likedAssessmentsArr);
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }
}
