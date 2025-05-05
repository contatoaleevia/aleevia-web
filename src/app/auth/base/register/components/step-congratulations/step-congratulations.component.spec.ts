import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCongratulationsComponent } from './step-congratulations.component';

describe('StepCongratulationsComponent', () => {
  let component: StepCongratulationsComponent;
  let fixture: ComponentFixture<StepCongratulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCongratulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepCongratulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
