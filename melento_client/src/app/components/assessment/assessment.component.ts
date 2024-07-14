import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
console.log('hey');
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent implements OnInit {
  arrProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedProducts: Product[] = [];
  likedAssessment: string[] = [];
  userId: any;
  userRole: any;

  constructor(
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
    const likedAssessmentString =
      this.localStorageService.getItem('likedAssessment');
    console.log(likedAssessmentString);
    console.log(typeof likedAssessmentString);
    if (likedAssessmentString) {
      this.likedAssessment = likedAssessmentString.split(',');
    } else {
      this.likedAssessment = [];
    }
    console.log(this.likedAssessment);
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      this.updatePaginatedProducts();
    });
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.arrProducts.slice(startIndex, endIndex);
  }

  displayDetails(cardTitle: string, cardSTitle: string) {
    alert(`Card Title: ${cardTitle}. Card Sub-Title: ${cardSTitle}`);
  }

  displayCartDetails(product: Product) {
    const role = this.localStorageService.getItem('role');
    if (role === null) {
      this.showError('Please login to add items to the cart.');
      return;
    }
    this.cartService.addToCart(product);
    this.showSuccess(`${product.aName} added to cart.`);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.arrProducts.length) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  getTotalPages(): number[] {
    return Array(Math.ceil(this.arrProducts.length / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }

  displayDetailss(aid: string) {
    this.router.navigate(['view-assessment-details/' + parseInt(aid)]);
  }
  showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
  showError(message: string) {
    this.toastr.error(message, 'Error', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
  addToLikedAssessments(assessmentId: string): void {
    if (this.userRole == 'admin') {
      this.userService.getUserById(this.userId).subscribe((user: User) => {
        if (!user.likedAssessments) {
          user.likedAssessments = [];
        }
        if (user.likedAssessments.includes(assessmentId)) {
          const index = user.likedAssessments.indexOf(assessmentId);
          if (index > -1) {
            user.likedAssessments.splice(index, 1);
            this.showSuccess('Assessment Unliked');
          }
        } else {
          user.likedAssessments.push(assessmentId);
          this.showSuccess('Assessment Liked ❤️');
        }
        console.log(user.likedAssessments);
        this.userService.updateUser(user).subscribe(
          (updatedUser: User) => {
            this.likedAssessment = updatedUser.likedAssessments;
            this.localStorageService.setItem(
              'likedAssessment',
              JSON.stringify(this.likedAssessment)
            );
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
      });
    } else if (this.userRole == 'faculty' || this.userRole == 'trainee') {
      this.showError(
        `This functionality is not yet available for role ${this.userRole}.`
      );
    } else {
      console.error('User ID not found in local storage');
      this.showError('Please Login to Like Assessments.');
    }
  }

  isLiked(assessmentId: string): boolean {
    return this.likedAssessment.includes(assessmentId);
  }
}
