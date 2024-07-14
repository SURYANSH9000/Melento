import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss',
})
export class ViewUserComponent implements OnInit {
  arrUser: User[] = [];
  filteredUsers = [...this.arrUser];
  currentPage = 1;
  pageSize = 10;
  constructor(private userservice: UserService) {
    this.userservice.getUsers().subscribe((data) => {
      this.arrUser = data;
      console.log(this.arrUser);
      this.updateFilteredUsers();
    });
  }
  ngOnInit(): void {
    this.updateFilteredUsers();
  }

  updateFilteredUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = this.arrUser.slice(startIndex, endIndex);
  }

  // updateFilteredCourses(): void {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.filteredCourses = this.arrCourse.slice(startIndex, endIndex);
  // }

  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.arrUser.filter(
      (user) =>
        user.fName.toLocaleLowerCase().includes(input) ||
        user.lName.toLocaleLowerCase().includes(input) ||
        user.id.toLocaleLowerCase().includes(input)
    );
    this.currentPage = 1;
    this.filteredUsers = filtered.slice(0, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateFilteredUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.arrUser.length / this.pageSize);
  }
}
