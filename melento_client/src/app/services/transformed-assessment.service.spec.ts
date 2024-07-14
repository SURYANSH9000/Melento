import { TestBed } from '@angular/core/testing';

import { TransformedAssessmentService } from './transformed-assessment.service';

describe('TransformedAssessmentService', () => {
  let service: TransformedAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransformedAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
