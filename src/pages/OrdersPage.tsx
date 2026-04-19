import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, CheckCircle, ChefHat, Star, QrCode, Timer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const statusConfig = {
  preparing: { label: 'Preparing', icon: ChefHat, className: 'bg-warning/10 text-warning' },
  ready: { label: 'Ready!', icon: CheckCircle, className: 'bg-canteen-green/10 text-canteen-green' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'bg-muted text-muted-foreground' },
};

const PrepTimer = ({ placedAt, estimatedTime }: { placedAt: Date; estimatedTime: number }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedMs = now - placedAt.getTime();
  const totalMs = estimatedTime * 60 * 1000;
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const remainingMins = Math.floor(remainingMs / 60000);
  const remainingSecs = Math.floor((remainingMs % 60000) / 1000);
  const progress = Math.min(100, (elapsedMs / totalMs) * 100);

  return (
    <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="w-5 h-5 text-warning animate-pulse-soft" />
        <span className="font-semibold text-sm">Estimated Preparation Time</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <ChefHat className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">~{estimatedTime} min total</span>
        </div>
        <span className="font-display text-lg text-warning">
          {remainingMs > 0 ? `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}` : 'Any moment now!'}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-warning to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>Order placed</span>
        <span>Ready</span>
      </div>
    </div>
  );
};

const OrderTrustBar = ({ status, rating }: { status: string; rating?: number }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
      <div className={`rounded-lg p-2 ${status !== 'completed' ? 'bg-canteen-green/10 text-canteen-green' : 'bg-muted text-muted-foreground'}`}>
        <CheckCircle className="w-4 h-4 mx-auto mb-1" />
        Verified queue
      </div>
      <div className={`rounded-lg p-2 ${status === 'ready' || status === 'completed' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
        <Clock className="w-4 h-4 mx-auto mb-1" />
        Live ETA
      </div>
      <div className={`rounded-lg p-2 ${rating ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <Star className="w-4 h-4 mx-auto mb-1" />
        {rating ? `${rating}/5 review` : 'Rate after pickup'}
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { orders, addReview } = useApp();
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showQR, setShowQR] = useState<string | null>(null);

  const sortedOrders = [...orders].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());

  const submitReview = (orderId: string) => {
    addReview(orderId, rating, reviewText);
    setReviewingId(null);
    setRating(0);
    setReviewText('');
  };

  if (orders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="font-display text-2xl mb-2">No Orders Yet</h2>
        <p className="text-muted-foreground">Place your first order from the menu!</p>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 max-w-2xl">
      <h1 className="font-display text-2xl text-gradient mb-6">My Orders</h1>
      <div className="space-y-4">
        {sortedOrders.map((order, i) => {
          const { label, icon: StatusIcon, className } = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-display text-lg">Token #{order.tokenNumber}</span>
                    <Badge className={`ml-2 ${className} border-0`}>
                      <StatusIcon className="w-3 h-3 mr-1" /> {label}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowQR(showQR === order.id ? null : order.id)}>
                    <QrCode className="w-4 h-4 mr-1" /> QR
                  </Button>
                </div>

                <OrderTrustBar status={order.status} rating={order.rating} />

                {showQR === order.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="flex justify-center py-3">
                    <QRCodeSVG value={`UNIVERSAL-CANTEEN-${order.tokenNumber}`} size={120} />
                  </motion.div>
                )}

                {order.status === 'preparing' && (
                  <PrepTimer placedAt={order.placedAt} estimatedTime={order.estimatedTime} />
                )}

                {order.status === 'ready' && (
                  <div className="bg-canteen-green/10 rounded-lg p-3 mb-3 text-center">
                    <p className="font-bold text-canteen-green text-lg animate-bounce-in">🎉 Your order is ready for pickup!</p>
                  </div>
                )}

                <div className="space-y-1 mb-3">
                  {order.items.map(c => (
                    <div key={c.item.id} className="flex justify-between text-sm">
                      <span>{c.item.name} × {c.quantity}</span>
                      <span className="text-muted-foreground">₹{c.item.price * c.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-gradient">₹{order.total.toFixed(0)}</span>
                </div>
                {order.discount > 0 && <p className="text-xs text-canteen-green">Saved ₹{order.discount.toFixed(0)} with {order.couponApplied}</p>}
                <p className="text-xs text-muted-foreground mt-1">Payment: {order.paymentMode === 'online' ? 'Online QR paid' : 'Cash'}</p>

                {order.status === 'completed' || order.status === 'ready' ? (
                  order.rating ? (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= order.rating! ? 'fill-accent text-accent' : 'text-muted'}`} />
                        ))}
                      </div>
                      {order.review && <p className="text-xs text-muted-foreground mt-1">"{order.review}"</p>}
                    </div>
                  ) : reviewingId === order.id ? (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setRating(s)}>
                            <Star className={`w-6 h-6 ${s <= rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                          </button>
                        ))}
                      </div>
                      <Input placeholder="Write a review..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => submitReview(order.id)} className="gradient-primary text-primary-foreground">Submit</Button>
                        <Button size="sm" variant="ghost" onClick={() => setReviewingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => setReviewingId(order.id)}>
                      <Star className="w-4 h-4 mr-1" /> Rate & Review
                    </Button>
                  )
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
