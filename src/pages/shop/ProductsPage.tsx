import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { PRODUCTS_SEED, Product, CartItem } from '@/data/shop/products';
import { trackPageView } from '@/lib/analytics';
import { safeStorage } from '@/lib/safe-storage';
import './ProductsPage.css';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => safeStorage.getJSON<CartItem[]>('cart', []));

  useEffect(() => {
    trackPageView('/shop');
    setProducts(PRODUCTS_SEED);
  }, []);

  const addToCart = (id: string) => {
    const newCart = [...cart, { productId: id, qty: 1 }];
    setCart(newCart);
    safeStorage.setJSON('cart', newCart);
  };

  return (
    <div className="shop-page">
      <PageTopbar title="商城" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            <div>{p.name}</div>
            <div>{p.priceLabel}</div>
            {p.stock === 0 ? (
              <div className="sold-out">已售罄</div>
            ) : (
              <button onClick={() => addToCart(p.id)}>加入购物车</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
