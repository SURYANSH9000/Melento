import { Component, OnInit } from '@angular/core';
import { PurchaseItem } from '../../../models/cart';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { Product } from '../../../models/add-assessment';
import { AttendanceService } from '../../../services/attendance.service';
import { Attendance } from '../../../models/attendance';
@Component({
  selector: 'app-attendance-screen',
  templateUrl: './attendance-screen.component.html',
  styleUrl: './attendance-screen.component.scss',
})
export class AttendanceScreenComponent implements OnInit {
  userId: any;
  userName: any;
  userRole: any;
  arrAttendanceScore: Attendance[] = [];
  assessments: PurchaseItem[] = [];
  arrAssessment: Product[] = [];
  isFacultyOrAdmin: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private attendanceservice: AttendanceService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('userId');
    this.attendanceservice.getAttendances().subscribe((data) => {
      this.arrAttendanceScore = data.filter(
        (attendance) => attendance.userId === this.userId
      );
      console.log(this.arrAttendanceScore);
    });
  }
}
