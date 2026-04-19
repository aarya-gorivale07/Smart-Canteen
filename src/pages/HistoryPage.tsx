import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, ChefHat, QrCode, Star, RotateCcw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const statusConfig = {
  preparing: { label: 'Preparing', icon: ChefHat, className: 'bg-warning/10 text-warning' },
  ready: { label: 'Ready', icon: CheckCircle, className: 'bg-canteen-green/10 text-canteen-green' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'bg-muted text-muted-foreground' },
};

const HistoryPage = () => {
  const { orders, addToCart } = useApp();
  const [showQR, setShowQR] = useState<string | null>(null);

  const historyOrders = useMemo(
    () => [...orders].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime()),
    [orders],
  );

  if (historyOrders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">🕘</div>
        <h2 className="font-display text-2xl mb-2">No Order History</h2>
        <p className="text-muted-foreground">Your previous orders will appear here after checkout.</p>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 max-w-3xl">
      <h1 className="font-display text-2xl text-gradient mb-2">Order History</h1>
      <p className="text-sm text-muted-foreground mb-6">View previous orders, repeat a favorite item, and review past purchases.</p>

      <div className="space-y-4">
        {historyOrders.map((order, index) => {
          const { label, icon: StatusIcon, className } = statusConfig[order.status];
          const elapsedMinutes = Math.max(1, Math.round((Date.now() - order.placedAt.getTime()) / 60000));

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-lg">Token #{order.tokenNumber}</span>
                        <Badge className={`${className} border-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" /> {label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.placedAt.toLocaleString()} • {elapsedMinutes} min ago
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowQR(showQR === order.id ? null : order.id)}>
                      <QrCode className="w-4 h-4 mr-1" /> QR
                    </Button>
                  </div>

                  {showQR === order.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="flex justify-center py-3">
                      <QRCodeSVG value={`UNIVERSAL-CANTEEN-${order.tokenNumber}`} size={120} />
                    </motion.div>
                  )}

                  <div className="space-y-1.5 mb-3">
                    {order.items.map((entry) => (
                      <div key={entry.item.id} className="text-sm rounded-lg bg-muted/30 p-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate">{entry.item.name} × {entry.quantity}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-muted-foreground">₹{entry.item.price * entry.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => addToCart(entry.item, entry.customization)}
                            >
                              <RotateCcw className="w-3 h-3 mr-1" /> Reorder
                            </Button>
                          </div>
                        </div>
                        {entry.customization && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.customization.spiceLevel && <Badge variant="secondary" className="text-[10px] h-5">{entry.customization.spiceLevel} spice</Badge>}
                            {entry.customization.notes && <Badge variant="outline" className="text-[10px] h-5">{entry.customization.notes}</Badge>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div>
                      <p className="font-semibold">Total ₹{order.total.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Payment: {order.paymentMode === 'online' ? 'Online' : 'Cash'}</p>
                    </div>
                    <div className="text-right">
                      {order.rating ? (
                        <div className="flex items-center gap-1 justify-end mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= order.rating! ? 'fill-accent text-accent' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                      ) : null}
                      {order.discount > 0 && (
                        <p className="text-xs text-canteen-green">Saved ₹{order.discount.toFixed(0)} with {order.couponApplied}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
