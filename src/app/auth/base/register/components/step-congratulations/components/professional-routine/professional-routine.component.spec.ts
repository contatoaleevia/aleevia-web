import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalRoutineComponent } from './professional-routine.component';

describe('ProfessionalRoutineComponent', () => {
  let component: ProfessionalRoutineComponent;
  let fixture: ComponentFixture<ProfessionalRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalRoutineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
