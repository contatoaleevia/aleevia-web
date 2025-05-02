import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPasswordComponent } from './step-password.component';

describe('StepPasswordComponent', () => {
  let component: StepPasswordComponent;
  let fixture: ComponentFixture<StepPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
