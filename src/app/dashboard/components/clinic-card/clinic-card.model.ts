export interface ClinicItem {
  icon: string;
  label: string;
  count?: number;
  description?: string;
  route?: string;
}

export interface ClinicCardData {
  title: string;
  logo?: string;
  items: ClinicItem[];
}