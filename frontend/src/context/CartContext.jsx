import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const COUPON_CODES = {
  SAVE10: 10,
  SAVE20: 20,
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shopco_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('shopco_cart', JSON.stringify(cart));
  }, [cart]);

  // Derived calculations using useMemo for optimal performance
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountPercent = useMemo(() => {
    return couponCode && COUPON_CODES[couponCode] ? COUPON_CODES[couponCode] : 0;
  }, [couponCode]);

  const discountAmount = useMemo(() => {
    return subtotal * (discountPercent / 100);
  }, [subtotal, discountPercent]);

  const deliveryFee = useMemo(() => {
    return subtotal > 0 ? 15 : 0;
  }, [subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + deliveryFee);
  }, [subtotal, discountAmount, deliveryFee]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Add item with inventory validation
  const addToCart = useCallback((product, requestedQty = 1, size = 'Large', color = 'Default') => {
    if (!product || product.quantity <= 0) {
      return { success: false, message: 'This product is out of stock.' };
    }

    let errorMsg = null;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product._id === product._id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newQty = existingItem.quantity + requestedQty;

        if (newQty > product.quantity) {
          errorMsg = `Cannot add more. Only ${product.quantity} items available in stock.`;
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        return updated;
      } else {
        if (requestedQty > product.quantity) {
          errorMsg = `Cannot add ${requestedQty}. Only ${product.quantity} available.`;
          return prevCart;
        }

        return [
          ...prevCart,
          {
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              images: product.images || [],
              quantity: product.quantity,
              category: product.category,
            },
            quantity: requestedQty,
            size,
            color,
          },
        ];
      }
    });

    if (errorMsg) {
      return { success: false, message: errorMsg };
    }
    return { success: true, message: 'Added to cart successfully!' };
  }, []);

  const updateQuantity = useCallback((index, newQty) => {
    setCart((prevCart) => {
      if (index < 0 || index >= prevCart.length) return prevCart;

      const item = prevCart[index];
      const maxStock = item.product.quantity;

      if (newQty <= 0) {
        return prevCart.filter((_, i) => i !== index);
      }

      if (newQty > maxStock) {
        return prevCart; // Block exceeding stock
      }

      const updated = [...prevCart];
      updated[index] = { ...item, quantity: newQty };
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  }, []);

  const applyCoupon = useCallback((code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
      return false;
    }

    if (COUPON_CODES[trimmed]) {
      setCouponCode(trimmed);
      setCouponSuccess(`Coupon ${trimmed} applied! (${COUPON_CODES[trimmed]}% discount)`);
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try SAVE10 or SAVE20.');
      setCouponSuccess('');
      return false;
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
    localStorage.removeItem('shopco_cart');
  }, []);

  const value = {
    cart,
    subtotal,
    discountPercent,
    discountAmount,
    deliveryFee,
    total,
    totalItems,
    couponCode,
    couponError,
    couponSuccess,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

