import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  addCategoryForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.addCategoryForm = this.fb.group({
      categoryId: ['', Validators.required],
      categoryDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get formControl() {
    return this.addCategoryForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.addCategoryForm.invalid) {
      return;
    }

    console.log('Form Value:', this.addCategoryForm.value);

    const tempCategory: Category = {
      id: this.addCategoryForm.value.categoryId,
      catDescription: this.addCategoryForm.value.categoryDescription,
    };

    this.categoryService.addCategory(tempCategory).subscribe(
      (response: any) => {
        console.log('Category added successfully', response);
        this.submitted = false; // Reset submitted after successful submission
        this.addCategoryForm.reset(); // Reset the form after successful submission
      },
      (error: any) => {
        console.error('Error adding category', error);
      }
    );
  }
}
