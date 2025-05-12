import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesChartComponent } from './categories-chart.component';
import { CategoriesChartData } from './categories-chart.model';

describe('CategoriesChartComponent', () => {
  let component: CategoriesChartComponent;
  let fixture: ComponentFixture<CategoriesChartComponent>;

  const mockChartData: CategoriesChartData = {
    title: 'Categorias mais visualizadas',
    total: 46,
    categories: [
      {
        name: 'Clínica',
        count: 28,
        percentage: 62.5,
        color: '#3B82F6'
      },
      {
        name: 'Horário Atendimento',
        count: 12,
        percentage: 26,
        color: '#F59E0B'
      },
      {
        name: 'Procedimentos',
        count: 6,
        percentage: 12.5,
        color: '#10B981'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesChartComponent);
    component = fixture.componentInstance;
    component.chartData = mockChartData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement = fixture.nativeElement.querySelector('.chart-title');
    expect(titleElement.textContent).toContain('Categorias mais visualizadas');
  });

  it('should display all categories in the legend', () => {
    const legendItems = fixture.nativeElement.querySelectorAll('.legend-item');
    expect(legendItems.length).toBe(3);
  });

  it('should have a canvas element for the chart', () => {
    const canvasElement = fixture.nativeElement.querySelector('canvas');
    expect(canvasElement).toBeTruthy();
  });
});
