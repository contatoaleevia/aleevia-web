export interface ChartDataPoint {
  month: string;
  value: number;
}

export interface InteractionsChartData {
  title: string;
  subtitle: string;
  totalLabel: string;
  totalValue: number | string;
  data: ChartDataPoint[];
}
