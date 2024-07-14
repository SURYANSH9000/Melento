import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', Validators.required],
        dob: ['', [Validators.required, this.dateOfBirthValidator]],
        role: ['', Validators.required],
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
  }

  ngOnInit(): void {}

  get formControl() {
    return this.registerForm.controls;
  }

  onSubmit(frmValue: any): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log(frmValue);
      console.log(frmValue.value.address.area);
      this.userService.getUsers().subscribe(
        (users: User[]) => {
          const newUserId = this.generateUniqueId(users);
          const tempUser: User = {
            id: newUserId,
            fName: frmValue.value.firstName,
            lName: frmValue.value.lastName,
            email: frmValue.value.email,
            mobile: frmValue.value.mobile,
            dob: frmValue.value.dob,
            role: frmValue.value.role,
            password: frmValue.value.password,
            address: {
              houseNo: frmValue.value.address.houseNo,
              street: frmValue.value.address.street,
              area: frmValue.value.address.area,
              state: frmValue.value.address.state,
              country: frmValue.value.address.country,
              pincode: frmValue.value.address.pincode,
            },
            likedAssessments: [],
          };

          this.userService.addUser(tempUser).subscribe(
            (response: any) => {
              console.log('User added successfully', response);
              // Close the modal here
              const modal = document.getElementById('registerModal');
              if (modal) {
                (modal as any).modal('hide');
              }
            },
            (error: any) => {
              console.error('Error adding user', error);
            }
          );
        },
        (error: any) => {
          console.error('Error fetching users', error);
        }
      );
      console.log(this.registerForm.value);
    } else {
      alert('Please check the form carefully!');
      return;
    }
  }

  generateUniqueId(users: User[]): string {
    if (users.length === 0) {
      return '1';
    }

    const maxId = Math.max(...users.map((user) => parseInt(user.id)));
    return String(maxId + 1);
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
