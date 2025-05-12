import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionsChartComponent } from './interactions-chart.component';
import { InteractionsChartData } from './interactions-chart.model';

describe('InteractionsChartComponent', () => {
  let component: InteractionsChartComponent;
  let fixture: ComponentFixture<InteractionsChartComponent>;

  const mockChartData: InteractionsChartData = {
    title: 'Interações',
    subtitle: 'Últimos meses',
    totalLabel: 'total',
    totalValue: '1,480',
    data: [
      { month: 'Apr', value: 850 },
      { month: 'May', value: 920 },
      { month: 'Jun', value: 990 },
      { month: 'Jul', value: 1200 },
      { month: 'Aug', value: 1050 },
      { month: 'Sep', value: 980 },
      { month: 'Oct', value: 1100 },
      { month: 'Nov', value: 950 },
      { month: 'Dec', value: 1150 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionsChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InteractionsChartComponent);
    component = fixture.componentInstance;
    component.chartData = mockChartData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title and subtitle', () => {
    const titleElement = fixture.nativeElement.querySelector('.chart-title');
    const subtitleElement = fixture.nativeElement.querySelector('.chart-subtitle');

    expect(titleElement.textContent).toContain('Interações');
    expect(subtitleElement.textContent).toContain('Últimos meses');
  });

  it('should display the correct total value', () => {
    const totalLabelElement = fixture.nativeElement.querySelector('.total-label');
    const totalValueElement = fixture.nativeElement.querySelector('.total-value');

    expect(totalLabelElement.textContent).toContain('total');
    expect(totalValueElement.textContent).toContain('1,480');
  });

  it('should have a canvas element for the chart', () => {
    const canvasElement = fixture.nativeElement.querySelector('canvas');
    expect(canvasElement).toBeTruthy();
  });
});