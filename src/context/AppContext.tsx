import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MenuItem, coupons } from '@/data/menuData';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useOrders } from '@/hooks/useOrders';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customization?: ItemCustomization;
}

export interface ItemCustomization {
  spiceLevel?: 'mild' | 'medium' | 'hot';
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'ready' | 'completed';
  tokenNumber: number;
  queuePosition: number;
  estimatedTime: number;
  placedAt: Date;
  paymentMode: 'online' | 'offline';
  couponApplied?: string;
  discount: number;
  rating?: number;
  review?: string;
  orderedBy?: string;
  orderedFor?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  type: 'feedback' | 'suggestion';
  suggestedPrice?: number;
  suggestedCategory?: 'breakfast' | 'lunch' | 'snacks' | 'beverages';
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface User {
  email: string;
  name: string;
  role: 'student' | 'admin';
}

export type ThemePreset = 'sunrise' | 'ocean' | 'forest' | 'cocoa';

export interface PendingUser {
  id: string;
  email: string;
  name: string;
  password: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuthResult {
  ok: boolean;
  message?: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => AuthResult;
  registerUser: (email: string, name: string, password: string) => AuthResult;
  pendingUsers: PendingUser[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  logout: () => void;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  cart: CartItem[];
  addToCart: (item: MenuItem, customization?: ItemCustomization) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (paymentMode: 'online' | 'offline', couponCode?: string, orderedBy?: string, orderedFor?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  feedbacks: Feedback[];
  addFeedback: (message: string, type: 'feedback' | 'suggestion', suggestedPrice?: number, suggestedCategory?: 'breakfast' | 'lunch' | 'snacks' | 'beverages') => void;
  updateFeedbackStatus: (id: string, status: Feedback['status']) => void;
  addReview: (orderId: string, rating: number, review: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  themePreset: ThemePreset;
  setThemePreset: React.Dispatch<React.SetStateAction<ThemePreset>>;
  canteenCapacity: number;
  setCanteenCapacity: React.Dispatch<React.SetStateAction<number>>;
  currentOccupancy: number;
  setCurrentOccupancy: React.Dispatch<React.SetStateAction<number>>;
  notifications: string[];
  clearNotification: (index: number) => void;
  orderReadyEvents: number;
  newOrderEvents: number;
  onlinePaymentEnabled: boolean;
  setOnlinePaymentEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  offlinePaymentEnabled: boolean;
  setOfflinePaymentEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
};

let tokenCounter = 1000;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { menuItems, setMenuItems } = useMenuItems();
  const { orders, saveOrder, updateStatus, updateReview } = useOrders();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: 'f1', userId: 'demo', userName: 'Rahul Sharma', message: 'The food quality has been great this week! Keep it up.', type: 'feedback', createdAt: new Date(Date.now() - 86400000), status: 'pending' },
    { id: 'f2', userId: 'demo2', userName: 'Priya Patel', message: 'Can we have pasta on the menu tomorrow?', type: 'suggestion', suggestedPrice: 80, suggestedCategory: 'lunch', createdAt: new Date(Date.now() - 43200000), status: 'pending' },
  ]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('ub-theme-mode');
    return saved ? saved === 'dark' : false;
  });
  const [themePreset, setThemePreset] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem('ub-theme-preset');
    if (saved === 'ocean' || saved === 'forest' || saved === 'cocoa' || saved === 'sunrise') {
      return saved;
    }
    return 'sunrise';
  });
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(() => {
    const saved = localStorage.getItem('ub-pending-users');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as PendingUser[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [canteenCapacity, setCanteenCapacity] = useState(80);
  const [currentOccupancy, setCurrentOccupancy] = useState(42);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [orderReadyEvents, setOrderReadyEvents] = useState(0);
  const [newOrderEvents, setNewOrderEvents] = useState(0);
  const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(true);
  const [offlinePaymentEnabled, setOfflinePaymentEnabled] = useState(true);

  // Keep tokenCounter in sync with existing orders
  useEffect(() => {
    if (orders.length > 0) {
      const maxToken = Math.max(...orders.map(o => o.tokenNumber));
      if (maxToken >= tokenCounter) tokenCounter = maxToken;
    }
  }, [orders]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('ub-theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dataset.theme = themePreset;
    localStorage.setItem('ub-theme-preset', themePreset);
  }, [themePreset]);

  useEffect(() => {
    localStorage.setItem('ub-pending-users', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  const login = useCallback((email: string, password: string): AuthResult => {
    const emailRegex = /^[a-z]+\.[a-z]+@universal\.edu\.in$/;
    if (!emailRegex.test(email)) return { ok: false, message: 'Please use your college email (firstname.lastname@universal.edu.in)' };

    if (email === 'aarya.gorivale@universal.edu.in' && password === 'aarya.2007') {
      setUser({ email, name: 'Aarya Gorivale', role: 'admin' });
      return { ok: true };
    }

    const approved = pendingUsers.find((u) => u.email === email && u.status === 'approved');
    if (approved) {
      if (approved.password !== password) {
        return { ok: false, message: 'Incorrect password.' };
      }
      setUser({ email, name: approved.name, role: 'student' });
      return { ok: true };
    }

    const pending = pendingUsers.find((u) => u.email === email && u.status === 'pending');
    if (pending) {
      return { ok: false, message: 'Your account is waiting for admin approval.' };
    }

    return { ok: false, message: 'No approved account found. Please register first.' };
  }, [pendingUsers]);

  const registerUser = useCallback((email: string, name: string, password: string): AuthResult => {
    const emailRegex = /^[a-z]+\.[a-z]+@universal\.edu\.in$/;
    if (!emailRegex.test(email)) {
      return { ok: false, message: 'Please use your college email (firstname.lastname@universal.edu.in)' };
    }
    if (!name.trim()) {
      return { ok: false, message: 'Please enter your full name.' };
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' };
    }
    if (pendingUsers.some((u) => u.email === email)) {
      return { ok: false, message: 'This email is already registered or pending approval.' };
    }

    setPendingUsers((prev) => [
      ...prev,
      {
        id: `pending-${Date.now()}`,
        email,
        name,
        password,
        requestedAt: new Date().toISOString(),
        status: 'pending',
      },
    ]);

    return { ok: true, message: 'Registration submitted. Waiting for admin approval.' };
  }, [pendingUsers]);

  const approveUser = useCallback((userId: string) => {
    setPendingUsers((prev) => prev.map((user) => user.id === userId ? { ...user, status: 'approved' } : user));
  }, []);

  const rejectUser = useCallback((userId: string) => {
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((item: MenuItem, customization?: ItemCustomization) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1, customization: customization ?? c.customization } : c);
      }
      return [...prev, { item, quantity: 1, customization }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(itemId);
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity: qty } : c));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback((paymentMode: 'online' | 'offline', couponCode?: string, orderedBy?: string, orderedFor?: string) => {
    if (cart.length === 0) return null;
    let subtotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
    let discount = 0;
    if (couponCode) {
      const coupon = coupons.find(c => c.code === couponCode);
      if (coupon && subtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent' ? subtotal * coupon.discount / 100 : coupon.discount;
      }
    }
    const token = ++tokenCounter;
    const activeOrders = orders.filter(o => o.status === 'preparing').length;
      const order: Order = {
      id: `order-${Date.now()}`,
        items: cart.map(item => ({ ...item, customization: item.customization })),
      total: subtotal - discount,
      status: 'preparing',
      tokenNumber: token,
      queuePosition: activeOrders + 1,
      estimatedTime: 10 + activeOrders * 3,
      placedAt: new Date(),
      paymentMode,
        couponApplied: couponCode,
      discount,
        orderedBy,
        orderedFor,
    };
    // Save to database
    saveOrder(order);
    setNewOrderEvents(c => c + 1);
    setCart([]);
    return order;
  }, [cart, orders, saveOrder]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (order && status === 'ready') {
      setNotifications(n => [...n, `Order #${order.tokenNumber} is ready for pickup! 🎉`]);
      setOrderReadyEvents(c => c + 1);
    }
    updateStatus(orderId, status);
  }, [orders, updateStatus]);

  const addFeedback = useCallback((message: string, type: 'feedback' | 'suggestion', suggestedPrice?: number, suggestedCategory?: 'breakfast' | 'lunch' | 'snacks' | 'beverages') => {
    if (!user) return;
    setFeedbacks(prev => [...prev, {
      id: `fb-${Date.now()}`,
      userId: user.email,
      userName: user.name,
      message,
      type,
      suggestedPrice,
      suggestedCategory,
      createdAt: new Date(),
      status: 'pending',
    }]);
  }, [user]);

  const updateFeedbackStatus = useCallback((id: string, status: Feedback['status']) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  }, []);

  const addReview = useCallback((orderId: string, rating: number, review: string) => {
    updateReview(orderId, rating, review);
  }, [updateReview]);

  const toggleTheme = useCallback(() => setIsDark(d => !d), []);

  const clearNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, registerUser, pendingUsers, approveUser, rejectUser, logout, menuItems, setMenuItems,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      orders, placeOrder, updateOrderStatus,
      feedbacks, addFeedback, updateFeedbackStatus, addReview,
      isDark, toggleTheme, themePreset, setThemePreset,
      canteenCapacity, setCanteenCapacity, currentOccupancy, setCurrentOccupancy,
      notifications, clearNotification, orderReadyEvents, newOrderEvents,
      onlinePaymentEnabled, setOnlinePaymentEnabled,
      offlinePaymentEnabled, setOfflinePaymentEnabled,
    }}>
      {children}
    </AppContext.Provider>
  );
};
