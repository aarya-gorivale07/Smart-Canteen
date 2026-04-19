import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import LoginPage from "@/pages/LoginPage";
import MenuPage from "@/pages/MenuPage";
import CartPage from "@/pages/CartPage";
import OrdersPage from "@/pages/OrdersPage";
import HistoryPage from "@/pages/HistoryPage";
import FeedbackPage from "@/pages/FeedbackPage";
import SettingsPage from "@/pages/SettingsPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMenuPage from "@/pages/admin/AdminMenuPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminFeedbackPage from "@/pages/admin/AdminFeedbackPage";
import AdminOrderFoodPage from "@/pages/admin/AdminOrderFoodPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AppHeader from "@/components/AppHeader";
import OrderReadyToast from "@/components/OrderReadyToast";
import AdminNewOrderToast from "@/components/AdminNewOrderToast";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  const { user } = useApp();

  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {user.role === 'student' && <OrderReadyToast />}
      {user.role === 'admin' && <AdminNewOrderToast />}
      <Routes>
        {user.role === 'admin' ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<AdminMenuPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/order-food" element={<AdminOrderFoodPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/menu" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </AppProvider>
);

export default App;
