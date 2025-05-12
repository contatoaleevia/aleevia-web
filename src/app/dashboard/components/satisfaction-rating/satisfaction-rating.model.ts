export interface RatingData {
  score: number;
  maxScore: number;
  totalRatings: number;
  trend: number;
  label: string;
}

export interface SatisfactionRatingData {
  ratings: RatingData[];
}
