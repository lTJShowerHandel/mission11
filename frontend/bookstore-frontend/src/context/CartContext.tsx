import { createContext, useContext, useEffect, useState } from 'react';
import type { Book } from '../api/booksApi';

export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (book: Book) => void;
  updateQuantity: (bookId: number, delta: number) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = sessionStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addToCart(book: Book) {
    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === book.bookId);
      if (existing) {
        return prev.map((i) =>
          i.bookId === book.bookId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { bookId: book.bookId, title: book.title, price: book.price, quantity: 1 }];
    });
  }

  function updateQuantity(bookId: number, delta: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === bookId);
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.bookId !== bookId);
      return prev.map((i) => (i.bookId === bookId ? { ...i, quantity: newQty } : i));
    });
  }

  function removeFromCart(bookId: number) {
    setItems((prev) => prev.filter((i) => i.bookId !== bookId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
