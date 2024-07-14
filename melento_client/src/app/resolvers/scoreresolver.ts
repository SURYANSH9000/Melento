import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AssessmentScoreService } from '../services/assessment-score.service';
@Injectable({
  providedIn: 'root'
})
export class ScoreResolver implements Resolve<any> {
  constructor(private assessmentScore: AssessmentScoreService) { 

  }
    resolve(): Observable<any> {    // Return an Observable that represents the API request(s) you want to
    // execute before the route is activated.
    return this.assessmentScore.getAssessmentScores();
  }
}