import { Injectable } from '@angular/core';
import { Attendance } from '../models/attendance';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  arrAttendance: Attendance[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {
    this, (this.arrAttendance = []);
  }

  getAttendances(): Observable<Attendance[]> {
    //return this.arrCourses
    return this.httpClient
      .get<Attendance[]>(this.baseUrl + '/attendence')
      .pipe(catchError(this.httpError));
  }

  getAttendanceById(id: number): Attendance {
    for (let i = 0; i < this.arrAttendance.length; i++) {
      if (id == parseInt(this.arrAttendance[i].id)) {
        return this.arrAttendance[i];
      }
    }

    return new Attendance('', '', '', '', '', '');
  }

  addAttendance(u: Attendance): Observable<Attendance> {
    return this.httpClient
      .post<Attendance>(
        this.baseUrl + '/attendence',
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }
  updateAttendance(u: Attendance): Observable<Attendance[]> {
    return this.httpClient
      .put<Attendance[]>(
        this.baseUrl + '/attendence/',
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
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
