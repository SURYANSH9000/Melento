import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransformedAssessment } from '../models/transformed-assessment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransformedAssessmentService {
  private apiUrl = 'http://localhost:3000/transformedAssessments';

  constructor(private http: HttpClient) {}

  getTransformedAssessments(): Observable<TransformedAssessment[]> {
    return this.http.get<TransformedAssessment[]>(this.apiUrl);
  }

  addTransformedAssessment(
    assessment: TransformedAssessment
  ): Observable<TransformedAssessment> {
    return this.http.post<TransformedAssessment>(this.apiUrl, assessment);
  }

  updateTransformedAssessment(
    assessment: TransformedAssessment
  ): Observable<TransformedAssessment> {
    return this.http.put<TransformedAssessment>(
      `${this.apiUrl}/${assessment.id}`,
      assessment
    );
  }
}
