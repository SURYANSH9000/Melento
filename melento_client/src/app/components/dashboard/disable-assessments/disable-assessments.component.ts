import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../../models/cart';
import { Product } from '../../../models/add-assessment';
import { DashboardService } from '../../../services/dashboard.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { ProductService } from '../../../services/add-assessment.service';

@Component({
  selector: 'app-disable-assessments',
  templateUrl: './disable-assessments.component.html',
  styleUrl: './disable-assessments.component.scss',
})
export class DisableAssessmentsComponent {
  arrCourse: Product[] = [];
  arrFilteredCourse: Product[] = [];
  userRole: any;
  userId: any;
  userName: any;
  constructor(
    private productservice: ProductService,
    private localService: LocalStorageService
  ) {
    this.userName = this.localService.getItem('userName');
    this.userId = this.localService.getItem('userId');
    this.userRole = this.localService.getItem('role');
    this.productservice.getProducts().subscribe((data) => {
      this.arrCourse = data;
      if (this.userRole === 'faculty') {
        this.arrFilteredCourse = this.arrCourse.filter(
          (data) => data.faculty_id === this.userId
        );
      } else {
        this.arrFilteredCourse = this.arrCourse;
      }
      console.log(this.arrCourse);
    });
  }
  setInactive(assessmentId: string): void {
    const selectedAssessment = this.arrCourse.find(
      (assessment) => assessment.id === assessmentId
    );
    if (selectedAssessment) {
      selectedAssessment.isActive = !selectedAssessment.isActive;
      this.productservice
        .updateAssessmentById(assessmentId, selectedAssessment)
        .subscribe(
          (response) => {
            console.log('Assessment updated successfully:', response);
          },
          (error) => {
            console.error('Error updating assessment:', error);
          }
        );
    }
  }
}
