import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  arrCategory: Category[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {
    this, (this.arrCategory = []);
  }

  getCategory(): Observable<Category[]> {
    //return this.arrCourses
    return this.httpClient
      .get<Category[]>(this.baseUrl + '/category')
      .pipe(catchError(this.httpError));
  }

  getCategoryById(id: number): Category {
    for (let i = 0; i < this.arrCategory.length; i++) {
      if (id == this.arrCategory[i].id) {
        return this.arrCategory[i];
      }
    }

    return new Category(0, '');
  }

  addCategory(u: Category): Observable<Category> {
    return this.httpClient
      .post<Category>(
        this.baseUrl + '/category',
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }
  updateCategory(u: Category): Observable<Category[]> {
    return this.httpClient
      .put<Category[]>(
        this.baseUrl + '/category/' + u.id,
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }

  private httpError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
