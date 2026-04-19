import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import MenuCard from '@/components/MenuCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, CreditCard, Banknote, ReceiptText, BadgeCheck, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminOrderFoodPage = () => {
  const merchantUpiId = '9321134059@fam';
  const merchantName = 'Universal Bites Canteen';
  const { menuItems, cart, clearCart, placeOrder, onlinePaymentEnabled, offlinePaymentEnabled, user } = useApp();
  const isMobile = useIsMobile();
  const [paymentMode, setPaymentMode] = useState<'online' | 'offline'>(onlinePaymentEnabled ? 'online' : 'offline');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [transactionVerified, setTransactionVerified] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(() => `UB-${Date.now().toString(36).toUpperCase()}`);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0),
    [cart],
  );

  const submitOrder = () => {
    setIsPlacingOrder(true);
    const order = placeOrder(paymentMode, undefined, user?.name, customerName.trim());
    if (order) {
      setPlacedOrderId(order.id);
      toast.success('Order placed successfully');
    }
    setIsPlacingOrder(false);
  };

  const handlePlaceOrder = () => {
    if (paymentMode === 'online') {
      setPaymentSessionId(`UB-${Date.now().toString(36).toUpperCase()}`);
      setPaymentConfirmed(false);
      setTransactionRef('');
      setTransactionVerified(false);
      setPaymentDialogOpen(true);
      return;
    }
    submitOrder();
  };

  const confirmOnlinePayment = () => {
    if (!paymentConfirmed || !transactionVerified) {
      toast.error('Please complete payment confirmation and verify the transaction ID first.');
      return;
    }
    submitOrder();
    setPaymentDialogOpen(false);
  };

  const verifyTransactionReference = async () => {
    if (!paymentConfirmed) {
      toast.error('Please tick the payment confirmation checkbox first.');
      return;
    }

    const normalizedRef = transactionRef.trim().toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9]{10,30}$/.test(normalizedRef)) {
      toast.error('Enter a valid UPI transaction ID (10-30 letters/numbers).');
      return;
    }

    setIsVerifyingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTransactionRef(normalizedRef);
    setTransactionVerified(true);
    setIsVerifyingPayment(false);
    toast.success('Transaction ID verified. You can now place the order.');
  };

  const closePaymentDialog = (open: boolean) => {
    setPaymentDialogOpen(open);
    if (!open) {
      setPaymentConfirmed(false);
      setTransactionRef('');
      setTransactionVerified(false);
      setIsVerifyingPayment(false);
    }
  };

  const paymentDisabled = !onlinePaymentEnabled && !offlinePaymentEnabled;
  const paymentAmount = cartTotal.toFixed(0);
  const qrValue = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantName)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${paymentSessionId}`)}`;
  const qrSize = isMobile ? 176 : 248;

  return (
    <div className="container py-6 px-4 pb-28">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-gradient">Order Food</h1>
          <p className="text-sm text-muted-foreground">Place a food order from the admin panel.</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <ShoppingCart className="w-3 h-3" /> {cartCount} items
        </Badge>
      </div>

      {placedOrderId && (
        <Card className="mb-6 border-canteen-green/30">
          <CardContent className="p-4 flex items-center gap-3">
            <ReceiptText className="w-5 h-5 text-canteen-green" />
            <div>
              <p className="font-semibold">Order placed successfully</p>
              <p className="text-sm text-muted-foreground">Your order reference is {placedOrderId}.</p>
              {customerName.trim() && <p className="text-xs text-muted-foreground">For {customerName.trim()}</p>}
              <p className="text-xs text-muted-foreground">Ordered by {user?.name ?? 'Admin'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
          {menuItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <Card className="shadow-lg">
            <CardContent className="p-4 space-y-4">
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Ordering as</p>
                <p className="font-semibold">{user?.name ?? 'Admin'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium" htmlFor="customer-name">Customer name</label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter the person who is ordering"
                />
              </div>

              <div>
                <h2 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Cart Summary
                </h2>
                <p className="text-xs text-muted-foreground">Review items before placing the order.</p>
              </div>

              <div className="space-y-2 max-h-56 overflow-auto pr-1">
                {cart.length > 0 ? (
                  cart.map((entry) => (
                    <div key={entry.item.id} className="text-sm rounded-lg bg-muted/30 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate mr-2">{entry.item.name} × {entry.quantity}</span>
                        <span className="text-muted-foreground shrink-0">₹{(entry.item.price * entry.quantity).toFixed(0)}</span>
                      </div>
                      {entry.customization && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {entry.customization.spiceLevel ? `${entry.customization.spiceLevel} spice` : ''}
                          {entry.customization.spiceLevel && entry.customization.notes ? ' • ' : ''}
                          {entry.customization.notes ?? ''}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">Add items to build the order.</p>
                )}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-gradient">₹{cartTotal.toFixed(0)}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Payment Mode</p>
                  <div className="flex gap-2">
                    {onlinePaymentEnabled && (
                      <Button
                        type="button"
                        variant={paymentMode === 'online' ? 'default' : 'outline'}
                        className="flex-1 gap-2"
                        onClick={() => setPaymentMode('online')}
                      >
                        <CreditCard className="w-4 h-4" /> Online
                      </Button>
                    )}
                    {offlinePaymentEnabled && (
                      <Button
                        type="button"
                        variant={paymentMode === 'offline' ? 'default' : 'outline'}
                        className="flex-1 gap-2"
                        onClick={() => setPaymentMode('offline')}
                      >
                        <Banknote className="w-4 h-4" /> Cash
                      </Button>
                    )}
                  </div>
                </div>

                {paymentDisabled && (
                  <p className="text-xs text-destructive">Payment is currently unavailable.</p>
                )}

                <Button
                  className="w-full gradient-primary text-primary-foreground"
                  onClick={handlePlaceOrder}
                  disabled={cartCount === 0 || paymentDisabled || customerName.trim().length === 0 || isPlacingOrder}
                >
                  {isPlacingOrder ? 'Processing...' : paymentMode === 'online' ? 'Pay by QR & Place Order' : 'Place Admin Order'}
                </Button>
                <Button variant="ghost" className="w-full" onClick={clearCart} disabled={cartCount === 0}>
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={closePaymentDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-full max-w-md max-h-[92vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Scan to pay the exact amount</DialogTitle>
            <DialogDescription>
              Use any UPI app to scan this code and pay the exact order total before submitting.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-[1.6rem] sm:rounded-[2rem] border border-white/10 bg-[#0b0b0d] p-2 sm:p-3 shadow-2xl">
            <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.7rem] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_40%),linear-gradient(180deg,_#17171b_0%,_#120f0f_100%)] p-3 sm:p-4">
              <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
              <div className="absolute -right-6 bottom-12 h-20 w-20 rounded-full bg-amber-400/10 blur-2xl" />

              <div className="relative mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200/80">Universal Bites</p>
                  <p className="text-xs text-white/70">Admin online payment</p>
                </div>
                <Badge variant="outline" className="border-white/15 bg-white/5 text-white/85">
                  <BadgeCheck className="w-3 h-3" /> Verified QR
                </Badge>
              </div>

              <div className="relative mx-auto flex w-fit items-center justify-center rounded-[1.2rem] sm:rounded-[1.5rem] bg-[#f4efe8] p-2.5 sm:p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9)_0%,_rgba(255,255,255,0.2)_100%)] opacity-20" />
                <div className="relative rounded-2xl bg-white p-2">
                  <QRCodeSVG value={qrValue} size={qrSize} includeMargin />
                  <div className="absolute left-1/2 top-1/2 flex h-10 w-10 sm:h-14 sm:w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#3a2914] shadow-lg">
                    <span className="text-sm sm:text-xl">🍽</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-3 sm:mt-4 rounded-[1.2rem] sm:rounded-[1.4rem] border border-white/10 bg-black/20 p-3 sm:p-4 text-white">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/55">Pay exact amount</p>
                    <p className="font-display text-3xl sm:text-4xl leading-none text-emerald-300">₹{paymentAmount}</p>
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
                    <span className="font-medium text-white">{paymentSessionId}</span>
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-[11px] text-white/55">
                  <ArrowRight className="w-3 h-3" /> Scan the QR, pay the exact amount, then confirm below.
                </p>
              </div>

              <div className="mt-3 sm:mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <label className="flex items-start gap-3 text-sm cursor-pointer text-white">
                  <Checkbox
                    checked={paymentConfirmed}
                    onCheckedChange={(checked) => {
                      setPaymentConfirmed(checked === true);
                      setTransactionVerified(false);
                    }}
                  />
                  <span>
                    I have scanned the QR code and paid the exact amount of ₹{paymentAmount}.
                  </span>
                </label>

                <div className="mt-3 space-y-2">
                  <p className="text-xs text-white/70">Enter UPI transaction ID (UTR/Ref No.)</p>
                  <div className="flex gap-2">
                    <Input
                      value={transactionRef}
                      onChange={(e) => {
                        setTransactionRef(e.target.value);
                        setTransactionVerified(false);
                      }}
                      placeholder="e.g. T240417123456789"
                      className="bg-white/10 border-white/15 text-white placeholder:text-white/45"
                    />
                    <Button
                      type="button"
                      onClick={verifyTransactionReference}
                      disabled={isVerifyingPayment}
                      variant="outline"
                      className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      {isVerifyingPayment ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  {transactionVerified && (
                    <p className="text-xs text-emerald-300">Verified transaction ID: {transactionRef}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 gap-2 sm:justify-between bg-[#0b0b0d] px-2 pb-2 pt-3 sm:px-0 sm:pb-0">
            <Button variant="outline" onClick={() => closePaymentDialog(false)} disabled={isPlacingOrder} className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white">
              Cancel
            </Button>
            <Button onClick={confirmOnlinePayment} disabled={!paymentConfirmed || !transactionVerified || isPlacingOrder || isVerifyingPayment} className="gradient-primary text-primary-foreground">
              {isPlacingOrder ? 'Submitting...' : 'Confirm payment & send order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrderFoodPage;
