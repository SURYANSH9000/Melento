import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceScreenComponent } from './attendance-screen.component';

describe('AttendanceScreenComponent', () => {
  let component: AttendanceScreenComponent;
  let fixture: ComponentFixture<AttendanceScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
