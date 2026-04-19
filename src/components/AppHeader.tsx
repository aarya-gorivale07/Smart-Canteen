import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, ShoppingCart, LogOut, Sun, Moon, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AppHeader = () => {
  const { user, logout, cart, isDark, toggleTheme, notifications, clearNotification } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const navItems = user?.role === 'admin'
    ? [
        { label: 'Dashboard', path: '/admin', emoji: '📊' },
        { label: 'Menu', path: '/admin/menu', emoji: '🍽' },
        { label: 'Orders', path: '/admin/orders', emoji: '📋' },
        { label: 'Order Food', path: '/admin/order-food', emoji: '🛒' },
        { label: 'Reports', path: '/admin/reports', emoji: '📈' },
        { label: 'Feedback', path: '/admin/feedback', emoji: '💬' },
        { label: 'Settings', path: '/admin/settings', emoji: '⚙️' },
      ]
    : [
        { label: 'Menu', path: '/menu', emoji: '🍽' },
        { label: 'My Orders', path: '/orders', emoji: '📋' },
        { label: 'History', path: '/history', emoji: '🕘' },
        { label: 'Feedback', path: '/feedback', emoji: '💬' },
        { label: 'Settings', path: '/settings', emoji: '⚙️' },
      ];

  return (
    <header className="sticky top-0 z-50 glass border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/menu')}>
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md glow-primary"
          >
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-lg text-gradient hidden sm:block group-hover:opacity-80 transition-opacity">Universal Canteen</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate(item.path)}
              className={`gap-1.5 ${location.pathname === item.path ? 'gradient-primary text-primary-foreground shadow-md' : 'hover:bg-muted'}`}
            >
              <span className="text-sm">{item.emoji}</span> {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-muted">
            <motion.div key={isDark ? 'dark' : 'light'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowNotif(!showNotif)}>
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center shadow-sm"
                >
                  {notifications.length}
                </motion.span>
              )}
            </Button>
            <AnimatePresence>
              {showNotif && notifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-card border rounded-2xl shadow-2xl p-3 space-y-2"
                >
                  <p className="text-xs font-semibold text-muted-foreground px-2">Notifications</p>
                  {notifications.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-sm p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <span className="flex-1">{n}</span>
                      <button onClick={() => clearNotification(i)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user?.role === 'student' && (
            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          )}

          <span className="text-sm text-muted-foreground hidden sm:block font-semibold">{user?.name}</span>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t overflow-x-auto">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 py-2.5 text-xs font-semibold text-center whitespace-nowrap flex flex-col items-center gap-0.5 transition-colors ${
              location.pathname === item.path ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground'
            }`}
          >
            <span>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default AppHeader;
