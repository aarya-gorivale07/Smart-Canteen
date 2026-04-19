import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Users, Star, IndianRupee, TrendingUp, UtensilsCrossed, MessageSquare, CreditCard, Banknote, Settings, Download, UserCheck, UserX } from 'lucide-react';

type AnalyticsRange = '7d' | '30d' | '90d';

const rangeToDays: Record<AnalyticsRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const AdminDashboard = () => {
  const {
    orders, feedbacks, menuItems, currentOccupancy, canteenCapacity,
    setCurrentOccupancy, setCanteenCapacity,
    onlinePaymentEnabled, setOnlinePaymentEnabled,
    offlinePaymentEnabled, setOfflinePaymentEnabled,
    pendingUsers, approveUser, rejectUser,
  } = useApp();
  const [analyticsRange, setAnalyticsRange] = useState<AnalyticsRange>('30d');

  const activeOrders = orders.filter(o => o.status === 'preparing').length;
  const pendingFeedback = feedbacks.filter(f => f.status === 'pending').length;
  const rangeOrders = useMemo(() => {
    const cutoff = Date.now() - rangeToDays[analyticsRange] * 24 * 60 * 60 * 1000;
    return orders.filter(order => order.placedAt.getTime() >= cutoff);
  }, [orders, analyticsRange]);

  const totalRevenue = rangeOrders.reduce((s, o) => s + o.total, 0);
  const avgRating = rangeOrders.filter(o => o.rating).reduce((s, o, _, a) => s + (o.rating! / a.length), 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-primary' },
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: IndianRupee, color: 'text-canteen-green' },
    { label: 'Active Orders', value: activeOrders, icon: TrendingUp, color: 'text-warning' },
    { label: 'Avg Rating', value: avgRating ? avgRating.toFixed(1) : 'N/A', icon: Star, color: 'text-accent' },
    { label: 'Menu Items', value: menuItems.length, icon: UtensilsCrossed, color: 'text-secondary' },
    { label: 'Occupancy', value: `${currentOccupancy}/${canteenCapacity}`, icon: Users, color: 'text-primary' },
    { label: 'Pending Feedback', value: pendingFeedback, icon: MessageSquare, color: 'text-warning' },
  ];

  const categoryBreakdown = ['breakfast', 'lunch', 'snacks', 'beverages'].map(cat => ({
    category: cat,
    orders: rangeOrders.reduce((s, o) => s + o.items.filter(i => i.item.category === cat).length, 0),
    revenue: rangeOrders.reduce((s, o) => s + o.items.filter(i => i.item.category === cat).reduce((r, i) => r + i.item.price * i.quantity, 0), 0),
  }));
  const pendingApprovalUsers = pendingUsers.filter((user) => user.status === 'pending');

  const exportCsv = () => {
    const rows = [
      ['range', analyticsRange],
      ['total_orders', String(rangeOrders.length)],
      ['total_revenue', String(totalRevenue)],
      ['avg_rating', avgRating ? avgRating.toFixed(1) : ''],
      ['pending_feedback', String(pendingFeedback)],
    ];
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-${analyticsRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="font-display text-2xl text-gradient mb-6">Admin Dashboard</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3 justify-between rounded-xl border bg-card p-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Analytics range</Label>
          <Select value={analyticsRange} onValueChange={value => setAnalyticsRange(value as AnalyticsRange)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={exportCsv} className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-xl">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Admin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Space Availability Control */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Canteen Space Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Current Occupancy: {currentOccupancy}</Label>
              <Slider
                value={[currentOccupancy]}
                min={0}
                max={canteenCapacity}
                step={1}
                onValueChange={([v]) => setCurrentOccupancy(v)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total Capacity: {canteenCapacity}</Label>
              <Slider
                value={[canteenCapacity]}
                min={20}
                max={200}
                step={5}
                onValueChange={([v]) => setCanteenCapacity(v)}
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <span className="text-sm font-semibold">Available Seats</span>
              <span className="font-display text-lg text-canteen-green">{canteenCapacity - currentOccupancy}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Mode Control */}
        <Card className="border-2 border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-5 h-5 text-secondary" /> Payment Mode Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Online Payment</p>
                  <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking</p>
                </div>
              </div>
              <Switch
                checked={onlinePaymentEnabled}
                onCheckedChange={setOnlinePaymentEnabled}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-canteen-green" />
                <div>
                  <p className="text-sm font-semibold">Cash Payment</p>
                  <p className="text-xs text-muted-foreground">Pay at counter</p>
                </div>
              </div>
              <Switch
                checked={offlinePaymentEnabled}
                onCheckedChange={setOfflinePaymentEnabled}
              />
            </div>
            {!onlinePaymentEnabled && !offlinePaymentEnabled && (
              <p className="text-destructive text-xs font-semibold">⚠️ At least one payment mode should be enabled!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" /> New User Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApprovalUsers.length > 0 ? (
            <div className="space-y-3">
              {pendingApprovalUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border bg-muted/30 p-3">
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Requested {new Date(user.requestedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => approveUser(user.id)} className="gap-1 bg-canteen-green text-canteen-green-foreground">
                      <UserCheck className="w-4 h-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rejectUser(user.id)} className="gap-1 text-destructive">
                      <UserX className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pending registrations right now.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Category Analytics ({analyticsRange})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryBreakdown.map(cat => (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="capitalize font-semibold w-24">{cat.category}</span>
                <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (cat.orders / Math.max(1, rangeOrders.length)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-20 text-right">{cat.orders} orders</span>
                <span className="text-sm font-semibold w-20 text-right">₹{cat.revenue}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {orders.slice(-5).reverse().map(o => (
              <div key={o.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted">
                <span className="font-semibold">#{o.tokenNumber}</span>
                <span>{o.items.map(i => i.item.name).join(', ').slice(0, 40)}</span>
                <span className="font-bold">₹{o.total.toFixed(0)}</span>
                <span className={`capitalize text-xs font-semibold ${
                  o.status === 'preparing' ? 'text-warning' : o.status === 'ready' ? 'text-canteen-green' : 'text-muted-foreground'
                }`}>{o.status}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-muted-foreground text-center py-4">No orders yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
