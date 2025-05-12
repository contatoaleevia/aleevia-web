import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHealthspaceSpaceComponent } from './form-healthspace-space.component';

describe('FormHealthspaceSpaceComponent', () => {
  let component: FormHealthspaceSpaceComponent;
  let fixture: ComponentFixture<FormHealthspaceSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHealthspaceSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHealthspaceSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
