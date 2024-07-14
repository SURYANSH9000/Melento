import { Component, OnInit } from '@angular/core';
import { Attendance } from '../../../models/attendance';
import { AttendanceService } from '../../../services/attendance.service';
import { ProductService } from '../../../services/add-assessment.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: '../../category/view-category/view-category.component.scss',
})
export class AttendanceComponent implements OnInit {
  userId: any;
  userRole: any;
  arrAttendance: Attendance[] = [];
  assessmentArr: any[] = [];
  filteredAssessments: Attendance[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private courseservice: AttendanceService,
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
        } else {
          this.assessmentArr = scores;
        }
        console.log(this.assessmentArr);
        this.loadUserAssessments();
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }

  loadUserAssessments(): void {
    this.courseservice.getAttendances().subscribe(
      (scores) => {
        this.arrAttendance = scores.filter((score) =>
          this.assessmentArr.some(
            (assessment) => assessment.id === score.assessmentId
          )
        );
        console.log(this.arrAttendance);
        this.updateFilteredAssessments();
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }

  updateFilteredAssessments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredAssessments = this.arrAttendance.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredAssessments();
    }
  }

  get totalPages(): number {
    const totalAssessments = this.arrAttendance.length;
    return Math.ceil(totalAssessments / this.pageSize);
  }
}
