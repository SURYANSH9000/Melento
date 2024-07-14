import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableAssessmentsComponent } from './disable-assessments.component';

describe('DisableAssessmentsComponent', () => {
  let component: DisableAssessmentsComponent;
  let fixture: ComponentFixture<DisableAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisableAssessmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisableAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
