import { Injectable } from '@angular/core';
import { AssessmentScore } from '../models/assessment-score';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentScoreService {
  arrUser: AssessmentScore[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {
    this, (this.arrUser = []);
  }

  getAssessmentScores(): Observable<AssessmentScore[]> {
    //return this.arrUsers
    return this.httpClient
      .get<AssessmentScore[]>(this.baseUrl + '/assessmentScore')
      .pipe(catchError(this.httpError));
  }

  getAssessmentScoreById(id: number): AssessmentScore {
    for (let i = 0; i < this.arrUser.length; i++) {
      if (id == parseInt(this.arrUser[i].id)) {
        return this.arrUser[i];
      }
    }

    return new AssessmentScore('', '', '', 0, '', 0, []);
  }

  addAssessmentScore(a: AssessmentScore): Observable<AssessmentScore> {
    return this.httpClient
      .post<AssessmentScore>(
        this.baseUrl + '/assessmentScore',
        JSON.stringify(a),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }
  updateAssessmentScore(a: AssessmentScore): Observable<AssessmentScore[]> {
    return this.httpClient
      .put<AssessmentScore[]>(
        this.baseUrl + '/assessmentScore/' + a.id,
        JSON.stringify(a),
        this.httpHeader
      )
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
