export interface Product {
  id: string;
  name: string;
  category: 'crystal' | 'talisman' | 'book' | 'other';
  priceLabel: string;
  stock?: number;
  ready: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export const PRODUCTS_SEED: Product[] = [
  { id: 'p1', name: '紫水晶', category: 'crystal', priceLabel: '¥299.00', stock: 10, ready: false },
];
