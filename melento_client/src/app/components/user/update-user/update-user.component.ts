import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service'; // Import UserService

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'], // Corrected typo here
})
export class UpdateUserComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  arrUsers: User[] = [];
  idUpdated: number = 0;

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Inject UserService
    this.myForm = this.fb.group(
      {
        id: [0, Validators.required],
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
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.arrUsers = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  get formControl() {
    return this.myForm.controls;
  }

  getAddressFormControl(controlName: string) {
    return (this.myForm.get('address') as FormGroup).controls[controlName];
  }

  onSubmit(frmValue: any): void {
    this.submitted = true;

    if (this.myForm.invalid) {
      return;
    }

    console.log('Form Value:', frmValue);

    const tempUser: User = {
      id: frmValue.id,
      fName: frmValue.firstName,
      lName: frmValue.lastName,
      email: frmValue.email,
      mobile: frmValue.mobile,
      dob: frmValue.dob,
      role: frmValue.role,
      password: frmValue.password,
      address: {
        houseNo: frmValue.address.houseNo,
        street: frmValue.address.street,
        area: frmValue.address.area,
        state: frmValue.address.state,
        country: frmValue.address.country,
        pincode: frmValue.address.pincode,
      },
      likedAssessments: [],
    };

    this.userService.updateUser(tempUser).subscribe(
      (response: User) => {
        console.log('User updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating user', error);
      }
    );
  }

  onChangeType(evt: any) {
    const idObtained = evt.target.value;
    this.idUpdated = parseInt(idObtained.split(':')[1].trim());

    this.userService.getUserById(this.idUpdated.toString()).subscribe(
      (user: User) => {
        this.myForm.patchValue({
          id: user.id,
          firstName: user.fName,
          lastName: user.lName,
          email: user.email,
          mobile: user.mobile,
          dob: user.dob,
          role: user.role,
          password: user.password, 
          confirmPassword: user.password, 
          address: {
            houseNo: user.address.houseNo,
            street: user.address.street,
            area: user.address.area,
            state: user.address.state,
            country: user.address.country,
            pincode: user.address.pincode,
          },
        });
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }


  dateOfBirthValidator(control: any) {
    const dob = new Date(control.value);
    const today = new Date();
    if (dob > today) {
      return { invalidDob: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
