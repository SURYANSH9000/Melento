import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedAssessmentsComponent } from './liked-assessments.component';

describe('LikedAssessmentsComponent', () => {
  let component: LikedAssessmentsComponent;
  let fixture: ComponentFixture<LikedAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LikedAssessmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
