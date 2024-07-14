import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PurchaseItem } from '../../../models/cart';
import { AssessmentScore } from '../../../models/assessment-score';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { AssessmentScoreService } from '../../../services/assessment-score.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProductService } from '../../../services/add-assessment.service';
import { Product } from '../../../models/add-assessment';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: '../../category/view-category/view-category.component.scss',
})
export class ReportComponent implements OnInit {
  userId: any;
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessmentScore: AssessmentScore[] = [];
  filteredScores: AssessmentScore[] = [];
  chartOptions = {};
  selectedAssessment: AssessmentScore[] = [];
  userRole: any;
  assessmentArr: Product[] = [];
  currentPage = 1;
  pageSize = 10;
  submitted = false;

  constructor(
    private localStorageService: LocalStorageService,
    private assessmentScoreService: AssessmentScoreService,
    private cdr: ChangeDetectorRef,
    private assessmentService: ProductService
  ) {
    this.getUserName();
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
    this.loadAssessment();
  }

  ngOnInit(): void {
    this.assessmentScoreService.getAssessmentScores().subscribe(
      (scores) => {
        this.arrAssessmentScore = scores.filter((score) =>
          this.assessmentArr.some(
            (assessment) => assessment.id === score.assessmentId
          )
        );
        this.updateFilteredScores();
        console.log(this.arrAssessmentScore);
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }

  private getUserName(): void {
    const name = this.localStorageService.getItem('name');
    if (name) {
      this.userName = name;
    } else {
      this.userName = '';
    }
  }

  loadAssessment(): void {
    this.assessmentService.getProducts().subscribe(
      (scores) => {
        if (this.userRole === 'faculty') {
          this.assessmentArr = scores.filter(
            (score) => score.faculty_id === this.userId
          );
        } else {
          this.assessmentArr = scores;
        }
        console.log(this.assessmentArr);
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }

  seeResults(aId: any): void {
    this.submitted = true;
    const selectedAssessment = this.arrAssessmentScore.find(
      (assessment) => assessment.id === aId
    );

    if (selectedAssessment && selectedAssessment.marksArray) {
      const marksArray = selectedAssessment.marksArray;
      const dataPoints = marksArray.map((marks, index) => ({
        label: `Q ${index + 1}`,
        y: marks,
        indexLabel: String(marks),
      }));

      console.log(marksArray);
      this.chartOptions = {};
      setTimeout(() => {
        this.chartOptions = {
          title: {
            text: 'Marks Distribution',
          },
          subtitles: [
            {
              text: `Assessment: ${selectedAssessment.assessmentName}`,
            },
            {
              text: `Total Marks: ${selectedAssessment.totalMarks}, Score: ${selectedAssessment.score}`,
            },
          ],
          animationEnabled: true,
          axisX: {
            title: 'Question Number',
          },
          axisY: {
            title: 'Marks Obtained',
            includeZero: true,
          },
          data: [
            {
              type: 'column',
              indexLabelFontColor: '#5A5757',
              indexLabelPlacement: 'outside',
              dataPoints: dataPoints,
            },
          ],
        };
      }, 0);
      this.cdr.detectChanges();
    } else {
      console.error(`Assessment with id ${aId} not found or has no marksArray`);
    }
  }

  generateReport(): void {
    const data = document.getElementById('pdfContent');
    if (data) {
      html2canvas(data).then((canvas) => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('assessment-report.pdf');
      });
    }
  }

  updateFilteredScores(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredScores = this.arrAssessmentScore.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredScores();
    }
  }

  get totalPages(): number {
    const totalScores = this.arrAssessmentScore.length;
    return Math.ceil(totalScores / this.pageSize);
  }
}
