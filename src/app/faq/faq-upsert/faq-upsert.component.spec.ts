import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqUpsertComponent } from './faq-upsert.component';

describe('FaqUpsertComponent', () => {
  let component: FaqUpsertComponent;
  let fixture: ComponentFixture<FaqUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
