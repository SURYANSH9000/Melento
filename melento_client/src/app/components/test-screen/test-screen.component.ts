import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessment-score';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance } from '../../models/attendance';

@Component({
  selector: 'app-test-screen',
  templateUrl: './test-screen.component.html',
  styleUrl: './test-screen.component.scss',
})
export class TestScreenComponent implements OnInit {
  userId: any;
  assessments: PurchaseItem[] = [];
  arrAssessment: Product[] = [];
  selectedAssessment: Product | null = null;
  itemForm: FormGroup[] = [];
  transformedAssessments: {
    instanceId: string;
    attemptNumber: number;
    assessment: Product;
  }[] = [];

  attemptedAssessments: Set<string> = new Set<string>();
  marks: number = 0;
  display: any;
  marksArray: number[] = [];
  currentAssessmentId: string = '';
  currentAssessmentMarks: number = 0;
  currentAssessmentName: string = '';
  allPurchases: any;
  arrAttendance: Attendance[] = [];
  submitted: boolean = false;
  timerColor: string = 'black';
  isFullScreen = false;
  isDashboardEmpty: boolean = false;
  isFaculty: boolean = false;
  assessmentIds: string[] = [];
  userPurchases: any[] = [];

  private chart: any;
  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
    private assessmentscoreservice: AssessmentScoreService,
    private attendanceservice: AttendanceService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('userId');
    this.loadUserAssessments();
  }
  loadUserAssessments(): void {
    this.assessmentService.getAssessments().subscribe(
      (purchases: Purchase[]) => {
        this.userPurchases = purchases.filter(
          (purchase) => purchase.userId === this.userId
        );
        this.userPurchases.forEach((purchase) => {
          purchase.items.forEach(
            (item: { quantity: number; assessmentId: string }) => {
              if (item.quantity > 0) {
                this.assessmentIds.push(item.assessmentId);
              }
            }
          );
        });
        console.log('User Purchases: ', this.userPurchases);
        if (this.userPurchases.length === 0) {
          this.isDashboardEmpty = true;
        }
        this.filterAssessments();
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }

  filterAssessments(): void {
    this.productService.getProducts().subscribe((data) => {
      const allAssessments = data;
      const filteredAssessments = allAssessments.filter((assessment) =>
        this.assessmentIds.includes(assessment.id)
      );
      this.arrAssessment = filteredAssessments;
      console.log(this.arrAssessment);
    });
  }
  getAssessmentQuantity(assessmentId: string): number {
    if (this.userPurchases.length > 0 && this.userPurchases[0].items) {
      const foundItem = this.userPurchases[0].items.find(
        (item: { assessmentId: string }) => item.assessmentId === assessmentId
      );
      return foundItem ? foundItem.quantity : 0;
    }
    return 0;
  }

  attemptAssessment(instanceId: string): void {
    console.log('Attempting assessment now:', instanceId);
    const selectedInstance = this.arrAssessment.find(
      (instance) => instance.id === instanceId
    );
    if (selectedInstance) {
      console.log(selectedInstance);
      this.selectedAssessment = selectedInstance;
      console.log('selected ass', this.selectedAssessment.itinery[0].options);

      this.itemForm = this.selectedAssessment.itinery.map(() =>
        this._formBuilder.group({
          selectedOption: [''],
        })
      );
      this.attemptedAssessments.add(instanceId);
    }
  }
  goBack(): void {
    this.selectedAssessment = null;
    this.itemForm = [];
  }

  submitAssessment(): void {
    this.isFullScreen = false;
    let qNo = 0;
    if (this.selectedAssessment) {
      const selectedOptions = this.itemForm.map((formGroup, index) => {
        const selectedOption = formGroup.get('selectedOption')?.value;
        return {
          question: this.selectedAssessment!.itinery[index].question,
          selectedOption: selectedOption,
        };
      });
      const marksPerQuestion = Math.floor(
        this.selectedAssessment.marks / this.selectedAssessment.itinery.length
      );
      for (qNo; qNo < selectedOptions.length; qNo++) {
        if (
          selectedOptions[qNo].selectedOption ===
          this.selectedAssessment.itinery[qNo].correctAns
        ) {
          this.marks = this.marks + marksPerQuestion;
          this.marksArray.push(
            Math.floor(
              this.selectedAssessment.marks /
                this.selectedAssessment.itinery.length
            )
          );
        } else {
          this.marksArray.push(0);
        }
      }
      // this.submitted = true;
      this.currentAssessmentMarks = this.selectedAssessment.marks;
      this.currentAssessmentName = this.selectedAssessment.aName;
      this.currentAssessmentId = this.selectedAssessment.id;
      this.updateAssessmentScore();
      this.decreaseAttempt(this.currentAssessmentId);
      this.goBack();
      this.attendanceservice.getAttendances().subscribe(
        (assessmentScores: Attendance[]) => {
          const newAttendanceId =
            this.generateUniqueIdAttendance(assessmentScores);
          const tempAttendance: Attendance = {
            id: newAttendanceId,
            assessmentName: this.currentAssessmentName,
            date: new Date().toISOString(),
            assessmentId: this.currentAssessmentId,
            userId: this.userId,
            status: 'Attempted',
          };
          this.attendanceservice.addAttendance(tempAttendance).subscribe(
            (response: any) => {
              console.log('Attendance added successfully', response);
            },
            (error: any) => {
              console.error('Error adding Attendance', error);
            }
          );
        },
        (error: any) => {
          console.error('Error fetching Assessment Scores', error);
        }
      );
    }
  }

  decreaseAttempt(assessmentId: any): void {
    const purchaseIndex = this.userPurchases.findIndex((purchase) => {
      return purchase.items.some(
        (item: { assessmentId: any }) => item.assessmentId === assessmentId
      );
    });

    if (purchaseIndex !== -1) {
      const itemIndex = this.userPurchases[purchaseIndex].items.findIndex(
        (item: { assessmentId: any }) => item.assessmentId === assessmentId
      );
      if (
        itemIndex !== -1 &&
        this.userPurchases[purchaseIndex].items[itemIndex].quantity > 0
      ) {
        this.userPurchases[purchaseIndex].items[itemIndex].quantity--;
        const updatedPurchase = this.userPurchases[purchaseIndex];
        this.assessmentService.updatePurchase(updatedPurchase).subscribe(
          (updatedPurchase) => {
            console.log('Purchase updated successfully:', updatedPurchase);
          },
          (error) => {
            console.error('Error updating purchase:', error);
          }
        );
      } else {
        console.warn('Quantity is already 0, cannot decrease further.');
      }
    } else {
      console.error('Assessment ID not found in userPurchases.');
    }
  }

  seeResults() {
    this.submitted = true;
  }
  updateAssessmentScore() {
    this.assessmentscoreservice.getAssessmentScores().subscribe(
      (assessments: AssessmentScore[]) => {
        const newUserId = this.generateUniqueId(assessments);
        console.log(this.selectedAssessment);
        const tempAssessmentScore: AssessmentScore = {
          id: newUserId,
          assessmentId: this.currentAssessmentId,
          userId: this.userId,
          score: this.marks,
          totalMarks: this.currentAssessmentMarks,
          assessmentName: this.currentAssessmentName,
          marksArray: this.marksArray,
        };

        this.assessmentscoreservice
          .addAssessmentScore(tempAssessmentScore)
          .subscribe(
            (response: any) => {
              console.log('Assessment Score added successfully', response);
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
  }

  isAttempted(assessmentId: string): boolean {
    return this.attemptedAssessments.has(assessmentId);
  }

  timer(minutes: number) {
    this.isFullScreen = true;
    let seconds: number = minutes * 60;
    let textSec: string;
    let statSec: number = 60;

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else {
        textSec = statSec.toString();
      }

      const displayMinutes = Math.floor(seconds / 60);
      const prefix = displayMinutes < 10 ? '0' : '';
      this.display = `${prefix}${displayMinutes}:${textSec}`;

      // Change color when less than 2 minutes
      if (seconds < 120) {
        this.timerColor = 'red';
      }

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
        this.submitAssessment();
        alert('Assessment has been submitted successfully');
      }
    }, 1000);
  }

  generateUniqueId(assessmentscore: AssessmentScore[]): string {
    if (assessmentscore.length === 0) {
      return '1';
    }

    const maxId = Math.max(
      ...assessmentscore.map((assessment) => parseInt(assessment.id))
    );
    return String(maxId + 1);
  }
  generateUniqueIdAttendance(assessmentscore: Attendance[]): string {
    if (assessmentscore.length === 0) {
      return '1';
    }

    const maxId = Math.max(
      ...assessmentscore.map((assessment) => parseInt(assessment.id))
    );
    return String(maxId + 1);
  }
}
