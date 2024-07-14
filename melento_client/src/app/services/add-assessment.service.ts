import { Injectable } from '@angular/core';
import { Itinery, Product } from '../models/add-assessment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  arrProducts: Product[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient, private http: HttpClient) {
    this, (this.arrProducts = []);
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.baseUrl}/assessment`)
      .pipe(catchError(this.httpError));
  }
  getProductsByFacultyId(facultyId: string): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.baseUrl}/assessment?faculty_id=${facultyId}`)
      .pipe(catchError(this.httpError));
  }
  addProduct(p: Product): Observable<Product> {
    return this.httpClient
      .post<Product>(
        this.baseUrl + '/assessment',
        JSON.stringify(p),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }
  getProductById(id: string): Observable<Product> {
    return this.httpClient
      .get<Product>(`${this.baseUrl}/assessment/${id}`)
      .pipe(catchError(this.httpError));
  }
  updateAssessmentById(id: string, assessment: Product): Observable<Product> {
    console.log('Assessment called successfully');
    console.log('Assessments: ', assessment);
    return this.httpClient
      .put<Product>(`${this.baseUrl}/assessment`, assessment, this.httpHeader)
      .pipe(catchError(this.httpError));
  }
  private httpError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
