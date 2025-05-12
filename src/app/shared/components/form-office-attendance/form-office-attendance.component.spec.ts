import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOfficeAttendanceComponent } from './form-office-attendance.component';

describe('FormOfficeAttendanceComponent', () => {
  let component: FormOfficeAttendanceComponent;
  let fixture: ComponentFixture<FormOfficeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOfficeAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOfficeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
