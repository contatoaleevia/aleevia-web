export interface CategoryItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CategoriesChartData {
  title: string;
  total: number;
  categories: CategoryItem[];
}
