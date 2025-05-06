import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepHealthcareSpaceComponent } from './step-healthcare-space.component';

describe('StepHealthcareSpaceComponent', () => {
  let component: StepHealthcareSpaceComponent;
  let fixture: ComponentFixture<StepHealthcareSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepHealthcareSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepHealthcareSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
