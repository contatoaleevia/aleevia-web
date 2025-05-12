import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SatisfactionRatingComponent } from './satisfaction-rating.component';
import { SatisfactionRatingData } from './satisfaction-rating.model';

describe('SatisfactionRatingComponent', () => {
  let component: SatisfactionRatingComponent;
  let fixture: ComponentFixture<SatisfactionRatingComponent>;

  const mockRatingData: SatisfactionRatingData = {
    ratings: [
      {
        score: 4.9,
        maxScore: 5.0,
        totalRatings: 170,
        trend: 15.8,
        label: 'Sobre atendimento'
      },
      {
        score: 4.5,
        maxScore: 5.0,
        totalRatings: 220,
        trend: 8.60,
        label: 'Sobre entrega'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatisfactionRatingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SatisfactionRatingComponent);
    component = fixture.componentInstance;
    component.ratingData = mockRatingData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of ratings', () => {
    const ratingItems = fixture.nativeElement.querySelectorAll('.rating-item');
    expect(ratingItems.length).toBe(2);
  });

  it('should assign the correct class for positive trend', () => {
    expect(component.getTrendClass(15.8)).toBe('positive');
  });

  it('should assign the correct class for negative trend', () => {
    expect(component.getTrendClass(-5.3)).toBe('negative');
  });

  it('should add a plus sign for positive trends', () => {
    expect(component.getTrendPrefix(8.6)).toBe('+');
  });

  it('should not add a plus sign for negative trends', () => {
    expect(component.getTrendPrefix(-4.2)).toBe('');
  });
});
