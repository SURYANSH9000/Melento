import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit {
  exampleForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this.exampleForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.exampleForm.valid) {
      console.log(this.exampleForm.value);
      this.send();
    } else {
      this.exampleForm.markAllAsTouched();
    }
  }
  async send() {
    emailjs.init('PTKbYB5BPTb3JkPBV');
    let response = await emailjs.send('service_4vklggj', 'template_i3gvi1j', {
      from_email: this.exampleForm.value.email,
      to_name: 'Jai Goyal',
      subject: 'Assessment.Co Contact Us Query',
      from_name: this.exampleForm.value.name,
      message: this.exampleForm.value.message,
    });
    this.showSuccess('Email has been sent!');
    this.exampleForm.reset();
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
}
