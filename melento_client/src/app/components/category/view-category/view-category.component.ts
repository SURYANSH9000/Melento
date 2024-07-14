import { Component } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.scss',
})
export class ViewCategoryComponent {
  arrCategory: Category[] = [];
  filteredCategories = [...this.arrCategory];
  currentPage = 1;
  pageSize = 5;
  constructor(private categoryService: CategoryService) {
    this.categoryService.getCategory().subscribe((data) => {
      this.arrCategory = data;
      console.log(this.arrCategory);
      this.updateFilteredCategories();
    });
  }

  updateFilteredCategories(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredCategories = this.arrCategory.slice(startIndex, endIndex);
  }

  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.arrCategory.filter((category) =>
      category.catDescription.toLowerCase().includes(input)
    );
    this.currentPage = 1; // Reset to first page on search
    this.filteredCategories = filtered.slice(0, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateFilteredCategories();
  }

  get totalPages(): number {
    return Math.ceil(this.arrCategory.length / this.pageSize);
  }
}
