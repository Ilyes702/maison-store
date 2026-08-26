"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type CartLine = {
  key: string; // productId+color+size composite
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  color?: string;
  size?: string;
  quantity: number;
  maxStock?: number;
};

type CartContextType = {
  lines: CartLine[];
  addItem: (line: Omit<CartLine, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "maison_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage only after mount to avoid SSR/hydration mismatch
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage may be unavailable; fail silently
    }
  }, [lines, isHydrated]);

  const addItem: CartContextType["addItem"] = (line) => {
    const key = `${line.productId}__${line.color || ""}__${line.size || ""}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key ? { ...l, quantity: l.quantity + line.quantity } : l
        );
      }
      return [...prev, { ...line, key }];
    });
  };

  const removeItem = (key: string) =>
    setLines((prev) => prev.filter((l) => l.key !== key));

  const updateQuantity = (key: string, quantity: number) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, quantity) } : l))
    );

  const clearCart = () => setLines([]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );
  const totalItems = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
