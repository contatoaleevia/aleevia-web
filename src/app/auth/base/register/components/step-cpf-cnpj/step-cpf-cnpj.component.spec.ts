import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCpfCnpjComponent } from './step-cpf-cnpj.component';

describe('StepCpfCnpjComponent', () => {
  let component: StepCpfCnpjComponent;
  let fixture: ComponentFixture<StepCpfCnpjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCpfCnpjComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepCpfCnpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
