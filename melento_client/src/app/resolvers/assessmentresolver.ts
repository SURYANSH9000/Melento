import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../services/add-assessment.service';
@Injectable({
  providedIn: 'root'
})
export class AssessmentResolver implements Resolve<any> {
  constructor(private assessmentService: ProductService) { 

  }
    resolve(): Observable<any> {    // Return an Observable that represents the API request(s) you want to
    // execute before the route is activated.
    return this.assessmentService.getProducts();
  }
}