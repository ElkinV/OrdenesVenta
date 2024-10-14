export interface SalesOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface SalesOrder {
  id?: number;
  customerName: string;
  items: SalesOrderItem[];
  total: number;
  date: string;
}