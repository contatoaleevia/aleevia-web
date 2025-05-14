import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCnpjComponent } from './form-cnpj.component';

describe('FormCnpjComponent', () => {
  let component: FormCnpjComponent;
  let fixture: ComponentFixture<FormCnpjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCnpjComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCnpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
