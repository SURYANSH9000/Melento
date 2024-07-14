import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  userId: any; // Replace with actual logic to get current logged-in user ID
  userRole: any;
  userName: any;
  attemptedAssessments: string[] = [];
  isFacultyorAdmin: boolean = false;

  constructor(private localStorageService: LocalStorageService) {
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
    this.userName = this.localStorageService.getItem('userName');
  }

  ngOnInit(): void {
    if (this.userRole === 'faculty' || this.userRole === 'admin') {
      this.isFacultyorAdmin = true;
    }
  }
}
