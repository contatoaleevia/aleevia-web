import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsCardComponent } from './statistics-card.component';
import { StatisticsCardData } from './statistics-card.model';

describe('StatisticsCardComponent', () => {
  let component: StatisticsCardComponent;
  let fixture: ComponentFixture<StatisticsCardComponent>;

  const mockStatsData: StatisticsCardData = {
    month: 'Abril/25',
    items: [
      {
        title: 'Número de pacientes',
        subtitle: 'Únicos atendidos',
        value: '1,250',
        trend: 15.80
      },
      {
        title: 'Frequência média de uso',
        subtitle: 'Interações/Paciente (única)',
        value: '1,180',
        trend: -4.90,
        isNegativeTrendGood: false
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsCardComponent);
    component = fixture.componentInstance;
    component.statsData = mockStatsData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct month', () => {
    const monthElement = fixture.nativeElement.querySelector('.current-month');
    expect(monthElement.textContent).toContain('Abril/25');
  });

  it('should display all stat items', () => {
    const statItems = fixture.nativeElement.querySelectorAll('.stat-item');
    expect(statItems.length).toBe(2);
  });

  it('should display the correct trend class for positive trends', () => {
    expect(component.getTrendClass({ trend: 15.80 })).toBe('positive');
  });

  it('should display the correct trend class for negative trends', () => {
    expect(component.getTrendClass({ trend: -4.90 })).toBe('negative');
  });

  it('should display the correct trend class for negative trends that are good', () => {
    expect(component.getTrendClass({ trend: -4.90, isNegativeTrendGood: true })).toBe('positive');
  });

  it('should add a plus sign to positive trends', () => {
    expect(component.getTrendPrefix(15.80)).toBe('+');
  });

  it('should not add a plus sign to negative trends', () => {
    expect(component.getTrendPrefix(-4.90)).toBe('');
  });
});
