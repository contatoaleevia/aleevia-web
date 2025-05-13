export interface StatItem {
  title: string;
  subtitle: string;
  value: string | number;
  trend: number;
  isNegativeTrendGood?: boolean;
}

export interface StatisticsCardData {
  items: StatItem[];
  month: string;
}
