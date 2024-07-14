import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Itinery, Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss'],
})
export class AddAssessmentComponent implements OnInit {
  @ViewChild('stepper') private stepper!: MatStepper;

  isLinear = false;
  userId: any;
  userRole: any;
  product: Product = new Product('', '', '', '', 0, '', true, 0, 0, '', []);
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  itineryForm: FormGroup;
  itineries: Itinery[] = [];
  arrProducts: Product[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');

    this.firstFormGroup = this.formBuilder.group({
      aNameCtrl: ['', [Validators.required, Validators.minLength(3)]],
      marksCtrl: ['', [Validators.required, Validators.min(1)]],
      timeCtrl: ['', [Validators.required, Validators.min(1)]],
      cIdCtrl: ['', Validators.required],
      facultyIdCtrl: ['', Validators.required],
      aDesCtrl: ['', Validators.required],
      priceCtrl: ['', [Validators.required, Validators.min(0)]],
      imgSrcCtrl: ['', Validators.required],
    });

    this.itineryForm = this.formBuilder.group({
      itineries: this.formBuilder.array([this.createItineryFormGroup()]),
    });

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.product = new Product(
      '',
      '',
      '',
      '',
      0,
      '',
      true,
      0,
      0,
      '',
      this.itineries
    );
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.arrProducts = data;
    });
  }

  createItineryFormGroup(): FormGroup {
    return this.formBuilder.group({
      category: ['', Validators.required],
      question: ['', [Validators.required, Validators.minLength(5)]],
      optionA: [''],
      optionB: [''],
      optionC: [''],
      optionD: [''],
      optionTrue: [{ value: 'True', disabled: true }],
      optionFalse: [{ value: 'False', disabled: true }],
      correctAns: ['', Validators.required],
    });
  }

  itineriesArr(): FormArray {
    return this.itineryForm.get('itineries') as FormArray;
  }

  addItineryFormGroup() {
    this.itineriesArr().push(this.createItineryFormGroup());
  }

  removeOrClearItinery(i: number) {
    this.itineriesArr().removeAt(i);
  }

  saveFirstStepData() {
    if (this.firstFormGroup.valid) {
      this.product.id = this.generateUniqueId(this.arrProducts);
      this.product.aName = this.firstFormGroup.value.aNameCtrl;
      this.product.marks = this.firstFormGroup.value.marksCtrl;
      this.product.time = this.firstFormGroup.value.timeCtrl;
      this.product.course_id = this.firstFormGroup.value.cIdCtrl;
      this.product.faculty_id = this.firstFormGroup.value.facultyIdCtrl;
      this.product.aDes = this.firstFormGroup.value.aDesCtrl;
      this.product.aPrice = this.firstFormGroup.value.priceCtrl;
      this.product.aImgSrc = this.firstFormGroup.value.imgSrcCtrl;

      this.stepper.next();
    } else {
      this.firstFormGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  saveSecondStepData() {
    if (this.itineryForm.valid) {
      console.log(this.itineryForm);
      this.itineryForm.value.itineries.forEach((fmData: any) => {
        const category = fmData.category;
        const question = fmData.question;
        const correctAns = fmData.correctAns;
        let options: string[] = [];
        if (category === 'mcq') {
          options = [
            fmData.optionA,
            fmData.optionB,
            fmData.optionC,
            fmData.optionD,
          ];
        } else if (category === 'truefalse') {
          options = ['True', 'False'];
        }

        const itineryId = this.generateUniqueId(this.itineries);
        this.itineries.push(
          new Itinery(itineryId, category, question, options, correctAns)
        );
      });

      this.product.itinery = this.itineries;
      this.productService.addProduct(this.product).subscribe((product) => {
        this.arrProducts.push(product);
        this.resetForm();
        this.stepper.next();
      });
    } else {
      this.itineryForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.itineryForm.reset();
    this.itineriesArr().clear();
    this.addItineryFormGroup();
  }

  generateUniqueId(items: { id: string }[]): string {
    if (items.length === 0) {
      return '1';
    }

    const maxId = Math.max(...items.map((item) => parseInt(item.id)));
    return String(maxId + 1);
  }
}
