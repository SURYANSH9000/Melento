import { Component, OnInit } from '@angular/core';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.scss',
})
export class ViewCourseComponent implements OnInit {
  arrCourse: Course[] = [];
  filteredCourses = [...this.arrCourse];
  currentPage = 1;
  pageSize = 5;
  constructor(private courseservice: CourseService) {
    this.courseservice.getCourses().subscribe((data) => {
      this.arrCourse = data;
      console.log(this.arrCourse);
      this.updateFilteredCourses();
    });
  }
  ngOnInit(): void {
    this.updateFilteredCourses();
  }

  updateFilteredCourses(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredCourses = this.arrCourse.slice(startIndex, endIndex);
  }

  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.arrCourse.filter(
      (course) =>
        course.cName.toLowerCase().includes(input) ||
        course.cDescription.toLowerCase().includes(input)
    );
    this.currentPage = 1; // Reset to first page on search
    this.filteredCourses = filtered.slice(0, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateFilteredCourses();
  }

  get totalPages(): number {
    return Math.ceil(this.arrCourse.length / this.pageSize);
  }
}
