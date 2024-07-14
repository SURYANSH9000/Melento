import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss'],
})
export class UpdateCourseComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  arrCourses: Course[] = [];
  idUpdated: number | null = null;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.myForm = this.fb.group({
      id: [null, Validators.required],
      courseName: ['', Validators.required],
      categoryId: ['', Validators.required],
      courseDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(
      (courses: Course[]) => {
        this.arrCourses = courses;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  get formControl() {
    return this.myForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.myForm.invalid) {
      return;
    }

    const tempCourse: Course = {
      id: this.myForm.value.id,
      cName: this.myForm.value.courseName,
      categoryId: this.myForm.value.categoryId,
      cDescription: this.myForm.value.courseDescription,
    };

    this.courseService.updateCourse(tempCourse).subscribe(
      (response: Course) => {
        console.log('Course updated successfully', response);
        this.submitted = false; // Reset submitted after successful submission
        this.myForm.reset(); // Reset the form after successful submission
        this.idUpdated = null; // Reset selected course ID after submission
      },
      (error: any) => {
        console.error('Error updating course', error);
      }
    );
  }

  onChangeType(evt: any): void {
    const idObtained = evt.target.value;
    this.idUpdated = parseInt(idObtained, 10);

    const selectedCourse = this.arrCourses.find(
      (course) => parseInt(course.id) === this.idUpdated
    );
    if (selectedCourse) {
      this.myForm.patchValue({
        id: selectedCourse.id,
        courseName: selectedCourse.cName,
        categoryId: selectedCourse.categoryId,
        courseDescription: selectedCourse.cDescription,
      });
    }
  }
}
