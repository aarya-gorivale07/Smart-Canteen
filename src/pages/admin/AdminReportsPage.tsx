import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Trophy, IndianRupee, ShoppingBag } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Bar, BarChart } from 'recharts';

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' });

const AdminReportsPage = () => {
  const { orders, menuItems } = useApp();

  const chartData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthOrders = orders.filter((order) => {
        const placed = order.placedAt;
        return placed.getMonth() === month && placed.getFullYear() === year;
      });
      const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        month: monthFormatter.format(date),
        orders: monthOrders.length,
        revenue,
      };
    });
    return months;
  }, [orders]);

  const itemStats = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    orders.forEach((order) => {
      order.items.forEach((entry) => {
        const current = map.get(entry.item.id) ?? { name: entry.item.name, quantity: 0, revenue: 0 };
        current.quantity += entry.quantity;
        current.revenue += entry.quantity * entry.item.price;
        map.set(entry.item.id, current);
      });
    });

    return [...map.entries()]
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);
  }, [orders]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const topSelling = itemStats[0];

  const totalMenuItems = menuItems.length;

  return (
    <div className="container py-6 px-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl text-gradient mb-2">Reports & Annual Graphs</h1>
        <p className="text-sm text-muted-foreground">Annual sales, order trends, and top-selling food items.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="font-display text-xl">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <IndianRupee className="w-5 h-5 text-canteen-green" />
            <div>
              <p className="text-xs text-muted-foreground">Annual Revenue</p>
              <p className="font-display text-xl">₹{totalRevenue.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Average Order Value</p>
              <p className="font-display text-xl">₹{averageOrderValue.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Menu Items</p>
              <p className="font-display text-xl">{totalMenuItems}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Annual Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              orders: { label: 'Orders', color: 'hsl(var(--primary))' },
              revenue: { label: 'Revenue', color: 'hsl(var(--canteen-green))' },
            }}
            className="h-[320px] w-full"
          >
            <LineChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Order Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: { label: 'Orders', color: 'hsl(var(--secondary))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="orders" fill="var(--color-orders)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" /> Top Selling Food
            </CardTitle>
          </CardHeader>
          <CardContent>
            {itemStats.length > 0 ? (
              <div className="space-y-3">
                {itemStats.map((item, index) => (
                  <div key={item.id} className="rounded-xl border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-sm">#{index + 1} {item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} sold</p>
                      </div>
                      <Badge variant="outline">₹{item.revenue.toFixed(0)}</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full"
                        style={{ width: `${Math.max(10, (item.quantity / Math.max(1, itemStats[0].quantity)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No sales data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportsPage;
