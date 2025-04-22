import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewScheduleComponent } from './modal-new-schedule.component';

describe('ModalNewScheduleComponent', () => {
  let component: ModalNewScheduleComponent;
  let fixture: ComponentFixture<ModalNewScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
