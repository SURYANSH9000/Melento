import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-assessment-score',
  templateUrl: './update-assessment-score.component.html',
  styleUrl: './update-assessment-score.component.scss',
})
export class UpdateAssessmentScoreComponent implements OnInit {
  criteriaForm: FormGroup;
  submittedValue: number | null = null;

  constructor(private fb: FormBuilder) {
    this.criteriaForm = this.fb.group({
      passingPercentage: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.criteriaForm.valid) {
      this.submittedValue = this.criteriaForm.value.passingPercentage;
      console.log('Passing Percentage:', this.submittedValue);
    }
  }
}
