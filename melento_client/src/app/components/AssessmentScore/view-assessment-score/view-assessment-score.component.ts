import { Component, Input, OnInit } from '@angular/core';
import { AssessmentScoreService } from '../../../services/assessment-score.service';
import { UserService } from '../../../services/user.service';
import { AssessmentScore } from '../../../models/assessment-score';
import { User } from '../../../models/user';
import { ProductService } from '../../../services/add-assessment.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-view-assessment-score',
  templateUrl: './view-assessment-score.component.html',
  styleUrls: ['../../category/view-category/view-category.component.scss'],
})
export class ViewAssessmentScoreComponent implements OnInit {
  @Input() adminScore: any[] = [];
  assessmentScores: any[] = [];
  users: User[] = [];
  assessmentArr: any[] = [];
  userId: any;
  userRole: any;
  filteredScores: any[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private assessmentScoreService: AssessmentScoreService,
    private userService: UserService,
    private assessmentService: ProductService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
  }

  ngOnInit(): void {
    this.loadAssessment();
  }

  loadAssessment(): void {
    this.assessmentService.getProducts().subscribe(
      (scores) => {
        if (this.userRole === 'faculty') {
          this.assessmentArr = scores.filter(
            (score) => score.faculty_id === this.userId
          );
          console.log(this.assessmentArr);
        } else {
          this.assessmentArr = scores;
        }
        console.log(this.assessmentArr);
        this.loadAssessmentScores();
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }

  loadAssessmentScores(): void {
    this.assessmentScoreService.getAssessmentScores().subscribe(
      (scores) => {
        this.assessmentScores = scores.filter((score) =>
          this.assessmentArr.some(
            (assessment) => assessment.id === score.assessmentId
          )
        );
        this.updateFilteredScores();
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }

  updateFilteredScores(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredScores = this.assessmentScores.slice(startIndex, endIndex);
    console.log(this.filteredScores);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredScores();
    }
  }

  get totalPages(): number {
    const totalScores = this.assessmentScores.length;
    return Math.ceil(totalScores / this.pageSize);
  }
}
