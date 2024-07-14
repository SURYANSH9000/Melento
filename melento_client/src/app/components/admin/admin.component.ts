import { Component, Input, input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/add-assessment';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessment-score';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  arrUser: User[] = [];
  userRole: string = '';
  filteredAssessments: Product[] = [];
  assessmentScores: any[] = [];
  constructor(private userservice: UserService, private localStorageService: LocalStorageService,private activatedRoute: ActivatedRoute,private assessmentScore: AssessmentScoreService) {
    this.activatedRoute.data.subscribe((response: any) => {
      console.log('PRODUCT FETCHING', response);
      // this.products = response.products;
      this.filteredAssessments = response.products;
      this.assessmentScores = response.prod;
      console.log("Hi: ",this.assessmentScores);
      console.log("Hi: ",this.filteredAssessments);
      console.log('PRODUCT FETCHED');
    });
    console.log( "User role is ", this.localStorageService.getItem('role'));
    this.userRole = this.localStorageService.getItem('role')!;
   };

}

