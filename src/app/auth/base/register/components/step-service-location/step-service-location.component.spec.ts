import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepServiceLocationComponent } from './step-service-location.component';

describe('StepServiceLocationComponent', () => {
  let component: StepServiceLocationComponent;
  let fixture: ComponentFixture<StepServiceLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepServiceLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepServiceLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
