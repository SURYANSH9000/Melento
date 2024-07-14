import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentDetailsComponent } from './view-assessment-details.component';

describe('ViewAssessmentDetailsComponent', () => {
  let component: ViewAssessmentDetailsComponent;
  let fixture: ComponentFixture<ViewAssessmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAssessmentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
