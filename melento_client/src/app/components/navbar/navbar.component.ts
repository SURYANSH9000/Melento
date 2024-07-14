import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';  
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/add-assessment.service'; // Adjust import as per your service path
import { Product } from '../../models/add-assessment'; // Adjust import as per your model path
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { CheckoutServiceService } from '../../services/checkout-service.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  hidden = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted: boolean = false;
  isLoggedIn: boolean = false;
  totalItems: number = 0;
  searchQuery: string = '';
  assessments: any[] = [];
  isAdminOrFaculty: boolean = false;
  userRole: any;
  userId: any;
  filteredAssessments: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private productService: ProductService, // Adjust service import as per your actual service
    private localStorageService: LocalStorageService,
    private checkoutService: CheckoutServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', Validators.required],
        dob: ['', [Validators.required, this.dateOfBirthValidator]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        address: this.fb.group({
          houseNo: ['', Validators.required],
          street: ['', Validators.required],
          area: ['', Validators.required],
          state: ['', Validators.required],
          country: ['', Validators.required],
          pincode: ['', Validators.required],
        }),
      },
      { validators: this.passwordMatchValidator }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkLogoutMessage();
    this.checkLogoinMessage();

    this.checkoutService.checkoutEvent.subscribe((cartItems) => {
      this.totalItems = cartItems.length;
    });

    this.checkLogin();
  }

  get formControl() {
    return this.registerForm.controls;
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  checkLogin() {
    this.userRole = this.localStorageService.getItem('role');
    this.isLoggedIn = this.userRole !== null;
    if (this.userRole == 'admin' || this.userRole == 'faculty') {
      this.isAdminOrFaculty = true;
    }
  }
  onInputChange(): void {
    if (this.searchQuery.trim()) {
      this.productService.getProducts().subscribe(
        (assessments: Product[]) => {
          this.filteredAssessments = assessments.filter(
            (assessment) =>
              assessment.aName
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase()) ||
              assessment.aDes
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase())
          );
          console.log(this.filteredAssessments);
        },
        (error: any) => {
          console.error('Error fetching assessments:', error);
        }
      );
    } else {
      this.filteredAssessments = [];
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
  
    // Fetch users to get existing IDs
    this.userService.getUserss().subscribe(
      (response) => {
        console.log('Users:', response.length);
        let newUserId = this.generateUniqueId(response);
        const user: User = {
          id: newUserId, // Generate unique ID
          fName: this.registerForm.value.firstName,
          lName: this.registerForm.value.lastName,
          email: this.registerForm.value.email,
          mobile: this.registerForm.value.mobile,
          dob: this.registerForm.value.dob,
          password: this.registerForm.value.password,
          role: 'trainee',
          address: {
            houseNo: this.registerForm.value.address.houseNo,
            street: this.registerForm.value.address.street,
            area: this.registerForm.value.address.area,
            state: this.registerForm.value.address.state,
            country: this.registerForm.value.address.country,
            pincode: this.registerForm.value.address.pincode,
          },
          likedAssessments: [],
        };
  
        // Call register method in the service
        this.userService.register(user).subscribe(
          (response) => {
            console.log('User registered successfully:', response);
            // Handle success response
            this.showSuccess('Registration successful!');
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error registering user:', error);
            // Handle error response
            this.showError('Error registering user.');
          }
        );
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
   

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.userService.login(email, password).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          const token = response.token;
          const role = response.role;
          this.localStorageService.setToken(token);

          this.localStorageService.setItem('role', response.role);
          this.localStorageService.setItem('userId', response.userId);
          this.localStorageService.setItem('userName', response.userName);
          this.localStorageService.setItem(
            'likedAssessment',
            response.likedAssessment
          );
          console.log('response is : ', response);
          this.isLoggedIn = true;
          $('#loginModal').modal('hide');
          window.location.reload();
          this.localStorageService.setItem('showLoginMessage', 'true');
        },
        (error: any) => {
          console.error('Login failed:', error);
          // alert('Login failed. Incorrect email or password.');
          this.showError('Login failed. Incorrect email / password.');
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  checkLogoinMessage(): void {
    const showLogoutMessage =
      this.localStorageService.getItem('showLoginMessage');
    if (showLogoutMessage) {
      this.showSuccess('Login successful!');
      this.localStorageService.removeItem('showLoginMessage');
    }
  }
  checkLogoutMessage(): void {
    const showLogoutMessage =
      this.localStorageService.getItem('showLogoutMessage');
    if (showLogoutMessage) {
      this.showSuccess('Logout successful!');
      this.localStorageService.removeItem('showLogoutMessage');
    }
  }
  showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  // Toastr error message
  showError(message: string) {
    this.toastr.error(message, 'Error', {
      closeButton: true,
      timeOut: 3000, // 3 seconds
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  onLogout(): void {
    this.localStorageService.removeItem('role');
    this.localStorageService.removeItem('token');
    localStorage.clear();
    this.isLoggedIn = false;
    this.localStorageService.setItem('showLogoutMessage', 'true');

    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  generateUniqueId(users: User[]): string {
    const existingIds = new Set(users.map((user) => parseInt(user.id, 10)).filter((id) => !isNaN(id)));
    let newId = existingIds.size > 0 ? Math.max(...existingIds) + 1 : 1;
    
    while (existingIds.has(newId)) {
      newId += 1;
    }
    
    return String(newId);
  }
  

  onSearch(): void {
    const foundAssessment = this.filteredAssessments.find(
      (assessment) =>
        assessment.aName.toLowerCase() === this.searchQuery.toLowerCase()
    );

    if (foundAssessment) {
      this.router.navigate(['/view-assessment-details', foundAssessment.id]);
    } else {
      console.log(`Assessment '${this.searchQuery}' not found.`);
      // Handle the case where the assessment is not found (e.g., show an alert)
    }
  }

  onSelectAssessment(assessment: Product): void {
    this.searchQuery = assessment.aName;
    this.filteredAssessments = [];
    this.router.navigate(['/view-assessment-details', assessment.id]);
  }

  passwordMatchValidator(
    formGroup: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  dateOfBirthValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();
    return dob < today ? null : { invalidDob: true };
  }
}
