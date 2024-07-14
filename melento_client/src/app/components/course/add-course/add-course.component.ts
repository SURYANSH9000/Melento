import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit {
  addCourseForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.addCourseForm = this.fb.group({
      courseId: ['', Validators.required],
      categoryId: ['', Validators.required],
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get formControl() {
    return this.addCourseForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.addCourseForm.invalid) {
      return;
    }

    console.log('Form Value:', this.addCourseForm.value);

    const tempCourse: Course = {
      id: this.addCourseForm.value.courseId,
      categoryId: this.addCourseForm.value.categoryId,
      cName: this.addCourseForm.value.courseName,
      cDescription: this.addCourseForm.value.courseDescription,
    };

    this.courseService.addCourse(tempCourse).subscribe(
      (response: any) => {
        console.log('Course added successfully', response);
      },
      (error: any) => {
        console.error('Error adding course', error);
      }
    );
  }
}
