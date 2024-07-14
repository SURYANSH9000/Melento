import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../services/add-assessment.service';
import { Product, Itinery } from '../../../models/add-assessment';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-update-assessment',
  templateUrl: './update-assessment.component.html',
  styleUrls: ['./update-assessment.component.scss'],
})
export class UpdateAssessmentComponent implements OnInit {
  assessmentSelectionForm: FormGroup;
  assessmentForm: FormGroup;
  questionsForm: FormGroup;
  assessments: Product[] = [];
  selectedAssessment: Product | null = null;
  userRole: any;
  userId: any;
  constructor(
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.assessmentSelectionForm = this.fb.group({
      selectedAssessmentId: ['', Validators.required],
    });
    {
      this.productService.getProducts().subscribe((data) => {
        this.assessments = data;
        console.log('hello: ', this.assessments);
        this.userRole = this.localStorageService.getItem('role');
        this.userId = this.localStorageService.getItem('userId');
        console.log(this.userRole);
      });
    }
    this.assessmentForm = this.fb.group({
      assessmentName: ['', Validators.required],
      assessmentDescription: ['', Validators.required],
      assessmentImage: ['', Validators.required],
      price: ['', Validators.required],
      time: ['', Validators.required],
    });

    this.questionsForm = this.fb.group({
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments(): void {
    this.productService.getProducts().subscribe((assessments: Product[]) => {
      this.assessments = assessments;
    });
  }

  createQuestion(question: any): FormGroup {
    console.log(question);
    return this.fb.group({
      id: [question.id, Validators.required],
      text: [question.text, Validators.required],
      type: [question.type, Validators.required],
      options: [question.options],
      correctAnswer: [question.correctAnswer, Validators.required],
    });
  }

  createChoice(choiceText: string): FormGroup {
    return this.fb.group({
      choiceText: [choiceText, Validators.required],
    });
  }

  get questionControls() {
    return (this.questionsForm.get('questions') as FormArray).controls;
  }

  addQuestion(): void {
    const questionArray = this.questionsForm.get('questions') as FormArray;
    const newQuestionId = questionArray.length + 1;
    questionArray.push(
      this.createQuestion({
        id: newQuestionId,
        text: '',
        type: 'multiple-choice',
        choices: ['', '', '', ''],
        correctAnswer: '',
      })
    );
  }

  getChoices(questionIndex: number): FormArray {
    return (this.questionsForm.get('questions') as FormArray)
      .at(questionIndex)
      .get('choices') as FormArray;
  }

  onQuestionTypeChange(questionIndex: number): void {
    const questionArray = this.questionsForm.get('questions') as FormArray;
    const question = questionArray.at(questionIndex) as FormGroup;

    const choicesArray = question.get('choices') as FormArray;
    while (choicesArray.length !== 0) {
      choicesArray.removeAt(0);
    }

    if (question.get('type')?.value === 'multiple-choice') {
      for (let i = 0; i < 4; i++) {
        choicesArray.push(this.createChoice(''));
      }
    } else if (question.get('type')?.value === 'true-false') {
      choicesArray.push(this.fb.group({ choiceText: 'true' }));
      choicesArray.push(this.fb.group({ choiceText: 'false' }));
    }
  }

  onAssessmentChange(event: any): void {
    const selectedAssessmentId = event.value;
    this.selectedAssessment =
      this.assessments.find(
        (assessment) => assessment.id === selectedAssessmentId
      ) || null;

    if (this.selectedAssessment) {
      this.assessmentForm.patchValue({
        assessmentName: this.selectedAssessment.aName,
        assessmentDescription: this.selectedAssessment.aDes,
        assessmentImage: this.selectedAssessment.aImgSrc,
        price: this.selectedAssessment.aPrice,
        time: this.selectedAssessment.time,
      });

      const questionArray = this.questionsForm.get('questions') as FormArray;
      questionArray.clear();

      this.selectedAssessment.itinery.forEach((question: any) => {
        questionArray.push(this.createQuestion(question));
      });
    }
  }

  updateAssessment(): void {
    if (!this.selectedAssessment) return;

    const updatedAssessmentData = this.assessmentForm.value;
    const questionsData = this.questionsForm.value.questions.map(
      (question: any, index: number) => ({
        ...question,
        id: index + 1,
        choices:
          question.type === 'true-false'
            ? ['true', 'false']
            : question.choices.map((choice: any) => choice.choiceText),
      })
    );

    const updatedAssessment: Product = {
      ...this.selectedAssessment,
      aName: updatedAssessmentData.assessmentName,
      aDes: updatedAssessmentData.assessmentDescription,
      aImgSrc: updatedAssessmentData.assessmentImage,
      aPrice: updatedAssessmentData.price,
      time: updatedAssessmentData.time,
      itinery: questionsData,
      subscribe: function (arg0: (assessment: any) => void): void {
        throw new Error('Function not implemented.');
      },
    };

    // Assuming updateAssessmentById() returns an Observable
    this.productService
      .updateAssessmentById(updatedAssessment.id, updatedAssessment)
      .subscribe(
        (response) => {
          console.log('Assessment updated successfully:', response);
          this.loadAssessments(); // Reload assessments to get the latest list
        },
        (error) => {
          console.error('Error updating assessment:', error);
        }
      );
  }
}
