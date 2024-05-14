export interface Transaction {
  value: number;
  date: string;
  from?: string;
  to?: string;
  title: string;
  amount?: number;
}
