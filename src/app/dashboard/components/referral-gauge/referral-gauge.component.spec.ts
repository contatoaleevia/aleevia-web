import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferralGaugeComponent } from './referral-gauge.component';
import { ReferralGaugeData } from './referral-gauge.model';

describe('ReferralGaugeComponent', () => {
  let component: ReferralGaugeComponent;
  let fixture: ComponentFixture<ReferralGaugeComponent>;

  const mockGaugeData: ReferralGaugeData = {
    title: 'Taxa de encaminhamento',
    subtitle: 'Atendimento humano',
    percentage: 72,
    description: 'Atendimento via Chat'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralGaugeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralGaugeComponent);
    component = fixture.componentInstance;
    component.gaugeData = mockGaugeData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title and subtitle', () => {
    const titleElement = fixture.nativeElement.querySelector('.gauge-title');
    const subtitleElement = fixture.nativeElement.querySelector('.gauge-subtitle');

    expect(titleElement.textContent).toContain('Taxa de encaminhamento');
    expect(subtitleElement.textContent).toContain('Atendimento humano');
  });

  it('should display the correct percentage', () => {
    const percentageElement = fixture.nativeElement.querySelector('.gauge-percentage');
    expect(percentageElement.textContent).toContain('72%');
  });

  it('should display the correct description', () => {
    const descriptionElement = fixture.nativeElement.querySelector('.gauge-description');
    expect(descriptionElement.textContent).toContain('Atendimento via Chat');
  });

  it('should have a canvas element for the gauge', () => {
    const canvasElement = fixture.nativeElement.querySelector('canvas');
    expect(canvasElement).toBeTruthy();
  });
});
