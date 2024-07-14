import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentPlotComponent } from './assessment-plot.component';

describe('AssessmentPlotComponent', () => {
  let component: AssessmentPlotComponent;
  let fixture: ComponentFixture<AssessmentPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
