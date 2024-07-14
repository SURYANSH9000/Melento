import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';
import {
  Document,
  Packer,
  Paragraph,
  Tab,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  ImageRun,
} from 'docx';

import { saveAs } from 'file-saver';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrl: './view-assessment.component.scss',
})
export class ViewAssessmentComponent implements OnInit {
  arrCourse: Product[] = [];
  userRole: any;
  userId: any;
  filteredAssessments = [...this.arrCourse];
  currentPage = 1;
  pageSize = 5;
  products: Product[] = [];
  @Input() adminproducts: Product[] = [];
  constructor(
    private productservice: ProductService,
    private localStorage: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    console.log('View Assessment Component');
    this.userRole = this.localStorage.getItem('role');
    this.userId = this.localStorage.getItem('userId');
    this.productservice.getProducts().subscribe((data) => {
      console.log(data);
      if (this.userRole === 'faculty') {
        this.filteredAssessments = data.filter(
          (assessment) => this.userId === assessment.faculty_id
        );
      } else {
        this.filteredAssessments = data;
      }
      console.log(this.filteredAssessments);

      this.updateFilteredAssessments();
      console.log(this.userRole);
    });
  }
  ngOnInit(): void {
    console.log('init called');
    console.log(
      'Activated route data in Component:::',
      this.activatedRoute.data
    );
  }
  generateDocx() {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Course ID')] }),
          new TableCell({ children: [new Paragraph('Course Name')] }),
          new TableCell({ children: [new Paragraph('Price')] }),
          new TableCell({ children: [new Paragraph('Course Description')] }),
        ],
      }),
    ];

    for (let course of this.arrCourse) {
      const row = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(course.id.toString())] }),
          new TableCell({ children: [new Paragraph(course.aName)] }),
          new TableCell({
            children: [new Paragraph(course.aPrice.toString())],
          }),
          new TableCell({ children: [new Paragraph(course.aDes)] }),
        ],
      });
      tableRows.push(row);
    }

    const table = new Table({
      style: 'MyCustomTableStyle',
      width: {
        size: 9070,
        type: WidthType.DXA,
      },
      rows: tableRows,
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun('Detailed Report on Available Assessments'),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'This report contains detailed information about the available assessments including their course ID, name, price, and description.',
                  break: 1,
                }),
              ],
            }),
            table,
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Note: The prices listed are subject to change and are current as of the date of this report.',
                  break: 1,
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'CourseTable.docx');
    });
  }

  updateFilteredAssessments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // this.filteredAssessments = this.filteredAssessments.slice(
    //   startIndex,
    //   endIndex
    // );
  }

  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.arrCourse.filter(
      (course) =>
        ((this.userRole === 'faculty' && this.userId === course.faculty_id) ||
          this.userRole === 'admin') &&
        (course.aName.toLowerCase().includes(input) ||
          course.aDes.toLowerCase().includes(input))
    );
    this.currentPage = 1; // Reset to first page on search
    this.filteredAssessments = filtered.slice(0, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateFilteredAssessments();
  }

  get totalPages(): number {
    const totalAssessments = this.filteredAssessments.length;
    return Math.ceil(totalAssessments / this.pageSize);
  }
}
