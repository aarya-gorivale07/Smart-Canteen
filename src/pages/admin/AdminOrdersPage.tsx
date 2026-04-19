import { useApp, Order } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { ChefHat, CheckCircle, Clock, CreditCard, Banknote, ShoppingBag, QrCode, BadgeCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

const statusConfig = {
  preparing: { label: 'Preparing', icon: ChefHat, className: 'bg-warning/10 text-warning border-0' },
  ready: { label: 'Ready', icon: CheckCircle, className: 'bg-canteen-green/10 text-canteen-green border-0' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'bg-muted text-muted-foreground border-0' },
};

const steps: { key: Order['status'] | 'received'; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
];

const statusIndex = (status: Order['status']) => {
  const map: Record<Order['status'], number> = { preparing: 1, ready: 2, completed: 3 };
  return map[status];
};

const OrderTimeline = ({ status }: { status: Order['status'] }) => {
  const current = statusIndex(status);
  return (
    <div className="flex items-center w-full my-3">
      {steps.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: active ? 1.15 : 1 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? active
                      ? 'bg-primary border-primary text-primary-foreground shadow-md'
                      : 'bg-canteen-green border-canteen-green text-white'
                    : 'bg-muted border-border text-muted-foreground'
                }`}
              >
                {done && !active ? '✓' : i + 1}
              </motion.div>
              <span className={`text-[10px] mt-1 font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-muted">
                <motion.div
                  className="h-full bg-canteen-green"
                  initial={{ width: 0 }}
                  animate={{ width: i < current ? '100%' : '0%' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useApp();
  const [selectedQrOrder, setSelectedQrOrder] = useState<Order | null>(null);
  const merchantUpiId = '9321134059@fam';
  const merchantName = 'Universal Bites Canteen';

  const activeOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const sorted = [...orders].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());

  const selectedQrValue = selectedQrOrder
    ? `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantName)}&am=${selectedQrOrder.total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order #${selectedQrOrder.tokenNumber}`)}`
    : '';

  const OrderCard = ({ order, i }: { order: typeof orders[0]; i: number }) => {
    const elapsed = Math.round((Date.now() - order.placedAt.getTime()) / 1000 / 60);
    return (
      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg">#{order.tokenNumber}</span>
                <Badge variant="outline" className="text-xs gap-1">
                  {order.paymentMode === 'online' ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                  {order.paymentMode === 'online' ? 'Online QR' : 'Cash'}
                </Badge>
                {order.paymentMode === 'online' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[10px] gap-1"
                    onClick={() => setSelectedQrOrder(order)}
                  >
                    <QrCode className="w-3 h-3" /> Show QR
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {elapsed}m ago
              </div>
            </div>

            <OrderTimeline status={order.status} />

            <div className="text-sm space-y-1 mb-3">
              {order.items.map(c => (
                <div key={c.item.id} className="rounded-lg bg-muted/30 p-2">
                  <div className="flex justify-between gap-3">
                    <span>{c.item.name} × {c.quantity}</span>
                    <span>₹{c.item.price * c.quantity}</span>
                  </div>
                  {c.customization && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {c.customization.spiceLevel ? `${c.customization.spiceLevel} spice` : ''}
                      {c.customization.spiceLevel && c.customization.notes ? ' • ' : ''}
                      {c.customization.notes ?? ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">Total: <span className="text-gradient">₹{order.total.toFixed(0)}</span></span>
              <div className="flex gap-2">
                {order.status === 'preparing' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')} className="bg-canteen-green text-canteen-green-foreground gap-1 shadow-sm">
                    <CheckCircle className="w-3 h-3" /> Mark Ready
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'completed')} className="gap-1">
                    <CheckCircle className="w-3 h-3" /> Complete
                  </Button>
                )}
              </div>
            </div>
              {order.orderedBy && (
                <p className="text-xs text-muted-foreground mt-2">Ordered by {order.orderedBy}</p>
              )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="font-display text-2xl text-gradient mb-6">Order Queue & Management</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-warning/30">
          <CardContent className="p-4 text-center">
            <ChefHat className="w-6 h-6 mx-auto text-warning mb-1" />
            <p className="font-display text-2xl text-warning">{activeOrders.length}</p>
            <p className="text-xs text-muted-foreground">Preparing</p>
          </CardContent>
        </Card>
        <Card className="border-canteen-green/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto text-canteen-green mb-1" />
            <p className="font-display text-2xl text-canteen-green">{readyOrders.length}</p>
            <p className="text-xs text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
            <p className="font-display text-2xl">{completedOrders.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {activeOrders.length > 0 && (
        <Card className="mb-6 border-2 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-warning" /> Live Order Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeOrders
                .sort((a, b) => a.placedAt.getTime() - b.placedAt.getTime())
                .map((order, i) => {
                  const elapsed = Math.round((Date.now() - order.placedAt.getTime()) / 1000 / 60);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-warning/5 border border-warning/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center font-display text-warning text-sm">
                          {i + 1}
                        </div>
                        <div>
                        {(order.orderedFor || order.orderedBy) && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {order.orderedBy && `Ordered by ${order.orderedBy}`}
                            {order.orderedBy && order.orderedFor ? ' • ' : ''}
                            {order.orderedFor && `For ${order.orderedFor}`}
                          </p>
                        )}
                          <span className="font-semibold text-sm">#{order.tokenNumber}</span>
                          <p className="text-xs text-muted-foreground">{order.items.map(c => c.item.name).join(', ').slice(0, 40)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{elapsed}m</span>
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')} className="bg-canteen-green text-canteen-green-foreground h-7 text-xs">
                          Ready
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({readyOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-3">
            {sorted.map((order, i) => <OrderCard key={order.id} order={order} i={i} />)}
            {orders.length === 0 && <p className="text-center text-muted-foreground py-12">No orders yet</p>}
          </div>
        </TabsContent>
        <TabsContent value="preparing">
          <div className="space-y-3">
            {activeOrders.map((order, i) => <OrderCard key={order.id} order={order} i={i} />)}
            {activeOrders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders preparing</p>}
          </div>
        </TabsContent>
        <TabsContent value="ready">
          <div className="space-y-3">
            {readyOrders.map((order, i) => <OrderCard key={order.id} order={order} i={i} />)}
            {readyOrders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders ready</p>}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="space-y-3">
            {completedOrders.map((order, i) => <OrderCard key={order.id} order={order} i={i} />)}
            {completedOrders.length === 0 && <p className="text-center text-muted-foreground py-8">No completed orders</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedQrOrder} onOpenChange={(open) => !open && setSelectedQrOrder(null)}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-full max-w-md max-h-[92vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Admin payment QR</DialogTitle>
            <DialogDescription>Scan this QR to pay the exact amount for this online order.</DialogDescription>
          </DialogHeader>

          {selectedQrOrder && (
            <div className="rounded-[1.6rem] sm:rounded-[2rem] border border-white/10 bg-[#0b0b0d] p-2 sm:p-3 shadow-2xl">
              <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.7rem] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_40%),linear-gradient(180deg,_#17171b_0%,_#120f0f_100%)] p-3 sm:p-4">
                <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
                <div className="absolute -right-6 bottom-12 h-20 w-20 rounded-full bg-amber-400/10 blur-2xl" />

                <div className="relative mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200/80">Universal Bites</p>
                    <p className="text-xs text-white/70">Online payment for order #{selectedQrOrder.tokenNumber}</p>
                  </div>
                  <Badge variant="outline" className="border-white/15 bg-white/5 text-white/85">
                    <BadgeCheck className="w-3 h-3" /> Verified QR
                  </Badge>
                </div>

                <div className="relative mx-auto flex w-fit items-center justify-center rounded-[1.2rem] sm:rounded-[1.5rem] bg-[#f4efe8] p-2.5 sm:p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                  <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9)_0%,_rgba(255,255,255,0.2)_100%)] opacity-20" />
                  <div className="relative rounded-2xl bg-white p-2">
                    <QRCodeSVG value={selectedQrValue} size={248} includeMargin />
                    <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#3a2914] shadow-lg">
                      <span className="text-xl">🍽</span>
                    </div>
                  </div>
                </div>

                <div className="relative mt-3 sm:mt-4 rounded-[1.2rem] sm:rounded-[1.4rem] border border-white/10 bg-black/20 p-3 sm:p-4 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/55">Pay exact amount</p>
                      <p className="font-display text-3xl sm:text-4xl leading-none text-emerald-300">₹{selectedQrOrder.total.toFixed(0)}</p>
                    </div>
                    <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                      UPI QR
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-xs text-white/75">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                      <span>Merchant</span>
                      <span className="font-medium text-white">{merchantName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                      <span>UPI ID</span>
                      <span className="font-medium text-white">{merchantUpiId}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                      <span>Reference</span>
                      <span className="font-medium text-white">#{selectedQrOrder.tokenNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersPage;
