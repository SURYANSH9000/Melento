import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  arrCourse: Course[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {
    this, (this.arrCourse = []);
  }

  getCourses(): Observable<Course[]> {
    //return this.arrCourses
    return this.httpClient
      .get<Course[]>(this.baseUrl + '/courses')
      .pipe(catchError(this.httpError));
  }

  getCourseById(id: number): Course {
    for (let i = 0; i < this.arrCourse.length; i++) {
      if (id == parseInt(this.arrCourse[i].id)) {
        return this.arrCourse[i];
      }
    }

    return new Course('', '', '', '');
  }

  addCourse(u: Course): Observable<Course> {
    return this.httpClient
      .post<Course>(
        this.baseUrl + '/courses',
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }
  updateCourse(course: Course): Observable<Course> {
    return this.httpClient.put<Course>(`${this.baseUrl}/courses/${course.id}`, course);
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
