import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  arrCategory: Category[] = [];
  idUpdated: number = 0;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.myForm = this.fb.group({
      id: [0, Validators.required],
      categoryDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe(
      (category: Category[]) => {
        this.arrCategory = category;
      },
      (error) => {
        console.error('Error fetching categories:', error);
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

    console.log('Form Value:', this.myForm.value);

    const tempCategory: Category = {
      id: this.myForm.value.id,
      catDescription: this.myForm.value.categoryDescription,
    };

    this.categoryService.updateCategory(tempCategory).subscribe(
      (response: any) => {
        console.log('Category updated successfully', response);
        this.submitted = false; // Reset submitted after successful submission
        this.myForm.reset(); // Reset the form after successful submission
      },
      (error: any) => {
        console.error('Error updating category', error);
      }
    );
  }

  onChangeType(evt: any) {
    console.log(evt.target.value);

    const idObtained = evt.target.value;
    this.idUpdated = parseInt(idObtained.split(':')[1].trim(), 10);
    console.log(this.idUpdated);

    for (let i = 0; i < this.arrCategory.length; i++) {
      if (this.idUpdated === this.arrCategory[i].id) {
        this.myForm.patchValue({
          id: this.arrCategory[i].id,
          categoryDescription: this.arrCategory[i].catDescription,
        });
      }
    }
  }
}
