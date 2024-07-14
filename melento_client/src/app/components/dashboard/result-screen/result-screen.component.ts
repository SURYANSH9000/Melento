import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PurchaseItem } from '../../../models/cart';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { AssessmentScore } from '../../../models/assessment-score';
import { AssessmentScoreService } from '../../../services/assessment-score.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { RouterModule } from '@angular/router';

interface DataPoint {
  label: string;
  y: number;
  indexLabel?: string;
}
@Component({
  selector: 'app-result-screen',
  templateUrl: './result-screen.component.html',
  styleUrl: './result-screen.component.scss',
})
export class ResultScreenComponent implements OnInit {
  userId: any; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessmentScore: AssessmentScore[] = [];
  chartOptions = {};
  selectedAssessment: AssessmentScore[] = [];

  submitted: boolean = false;
  ngOnInit(): void {
    this.getUserName();
    this.userId = this.localStorageService.getItem('userId');
  }
  constructor(
    private localStorageService: LocalStorageService,
    private assessmentscoreservice: AssessmentScoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.assessmentscoreservice.getAssessmentScores().subscribe((data) => {
      this.arrAssessmentScore = data.filter(
        (score) => score.userId === this.userId
      );
      console.log(this.arrAssessmentScore);
      this.cdr.detectChanges();
    });
  }
  private getUserName(): void {
    const name = this.localStorageService.getItem('name');
    if (name) {
      this.userName = name;
    } else {
      this.userName = '';
    }
  }

  seeResults(aId: any): void {
    this.submitted = true; // Reset submitted to false before updating
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
            title: 'Question Number', // Name for the X-axis
          },
          axisY: {
            title: 'Marks Obtained', // Name for the Y-axis
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

  generateReport() {
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

  seeAssessments() {
    console.log('Hello');
  }
}
