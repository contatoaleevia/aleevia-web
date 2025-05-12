import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfficeAttendanceComponent } from './view-office-attendance.component';

describe('ViewOfficeAttendanceComponent', () => {
  let component: ViewOfficeAttendanceComponent;
  let fixture: ComponentFixture<ViewOfficeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOfficeAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOfficeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
