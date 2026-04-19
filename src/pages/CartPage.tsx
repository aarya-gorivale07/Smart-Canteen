import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Trash2, Minus, Plus, Tag, CreditCard, Banknote, CheckCircle, AlertCircle, Sparkles, ShoppingBag, BadgeCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { coupons } from '@/data/menuData';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const CartPage = () => {
  const merchantUpiId = '9321134059@fam';
  const merchantName = 'Universal Bites Canteen';
  const { cart, updateQuantity, removeFromCart, placeOrder, onlinePaymentEnabled, offlinePaymentEnabled } = useApp();
  const isMobile = useIsMobile();
  const [couponCode, setCouponCode] = useState('');
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [transactionVerified, setTransactionVerified] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(() => `UB-${Date.now().toString(36).toUpperCase()}`);
  const [preferredPaymentMode, setPreferredPaymentMode] = useState<'online' | 'offline'>(() => {
    const saved = localStorage.getItem('ub-preferred-payment');
    return saved === 'offline' ? 'offline' : 'online';
  });

  // Default to first available payment mode
  const defaultMode = onlinePaymentEnabled
    ? (preferredPaymentMode === 'offline' && offlinePaymentEnabled ? 'offline' : 'online')
    : offlinePaymentEnabled ? 'offline' : 'online';
  const [paymentMode, setPaymentMode] = useState<'online' | 'offline'>(defaultMode);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('ub-preferred-payment', paymentMode);
  }, [paymentMode]);

  const subtotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
  const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
  const discount = coupon && subtotal >= coupon.minOrder
    ? coupon.type === 'percent' ? subtotal * coupon.discount / 100 : coupon.discount
    : 0;
  const total = subtotal - discount;
  const paymentAmount = total.toFixed(0);
  const recommendedCoupon = useMemo(() => {
    const eligible = coupons.filter(c => subtotal >= c.minOrder);
    if (eligible.length === 0) return null;
    return eligible.reduce((best, current) => {
      const bestSavings = best.type === 'percent' ? subtotal * best.discount / 100 : best.discount;
      const currentSavings = current.type === 'percent' ? subtotal * current.discount / 100 : current.discount;
      return currentSavings > bestSavings ? current : best;
    });
  }, [subtotal]);

  const applyCoupon = () => {
    const found = coupons.find(c => c.code === couponCode.toUpperCase());
    setCouponValid(!!found && subtotal >= (found?.minOrder ?? 0));
  };

  const applyRecommendedCoupon = () => {
    if (!recommendedCoupon) return;
    setCouponCode(recommendedCoupon.code);
    setCouponValid(subtotal >= recommendedCoupon.minOrder);
  };

  const startOnlinePayment = () => {
    setPaymentSessionId(`UB-${Date.now().toString(36).toUpperCase()}`);
    setPaymentConfirmed(false);
    setTransactionRef('');
    setTransactionVerified(false);
    setPaymentDialogOpen(true);
  };

  const submitOrder = (mode: 'online' | 'offline') => {
    setIsPlacingOrder(true);
    const order = placeOrder(mode, couponValid ? couponCode.toUpperCase() : undefined);
    if (order) {
      if (mode === 'online') {
        toast.success('Payment confirmed. Your order has been sent to the kitchen.');
      } else {
        toast.success('Your order has been placed.');
      }
      navigate('/orders');
      return;
    }
    setIsPlacingOrder(false);
  };

  const handlePrimaryAction = () => {
    if (paymentMode === 'online') {
      startOnlinePayment();
      return;
    }
    submitOrder('offline');
  };

  const confirmOnlinePayment = () => {
    if (!paymentConfirmed || !transactionVerified) {
      toast.error('Please complete payment confirmation and verify the transaction ID first.');
      return;
    }
    submitOrder('online');
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

  const qrValue = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantName)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${paymentSessionId}`)}`;
  const qrSize = isMobile ? 176 : 248;

  const noPaymentAvailable = !onlinePaymentEnabled && !offlinePaymentEnabled;

  if (cart.length === 0) {
    return (
      <div className="container py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">🛒</motion.div>
        <h2 className="font-display text-2xl mb-2">Cart is Empty</h2>
        <p className="text-muted-foreground mb-4">Add some delicious items from the menu!</p>
        <Button onClick={() => navigate('/menu')} className="gradient-primary text-primary-foreground">Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 max-w-2xl">
      <h1 className="font-display text-2xl text-gradient mb-6">Your Cart</h1>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {cart.map(c => (
            <motion.div
              key={c.item.id}
              layout
              exit={{ opacity: 0, x: -100 }}
              className="bg-card rounded-xl border p-3 flex items-center gap-3"
            >
              <img src={c.item.image} alt={c.item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{c.item.name}</h3>
                <p className="text-sm text-muted-foreground">₹{c.item.price}</p>
                {c.customization && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.customization.spiceLevel && (
                      <Badge variant="secondary" className="text-[10px] h-5">{c.customization.spiceLevel} spice</Badge>
                    )}
                    {c.customization.notes && (
                      <Badge variant="outline" className="text-[10px] h-5 max-w-40 truncate">{c.customization.notes}</Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateQuantity(c.item.id, c.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                  <span className="font-bold text-sm w-6 text-center">{c.quantity}</span>
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateQuantity(c.item.id, c.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                  <Slider
                    value={[c.quantity]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([v]) => updateQuantity(c.item.id, v)}
                    className="w-20 ml-2"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gradient">₹{c.item.price * c.quantity}</p>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => removeFromCart(c.item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Coupon */}
      <div className="bg-card rounded-xl border p-4 mb-4">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Tag className="w-4 h-4" /> Apply Coupon</h3>
        <div className="flex gap-2">
          <Input placeholder="Enter code" value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponValid(null); }} className="uppercase" />
          <Button onClick={applyCoupon} variant="outline">Apply</Button>
        </div>
        {recommendedCoupon && (
          <div className="mt-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-accent" /> Best coupon for this order
            </div>
            <p className="text-xs text-muted-foreground">
              Try <span className="font-semibold text-foreground">{recommendedCoupon.code}</span> to save more.
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={applyRecommendedCoupon}>
              Apply Recommended Coupon
            </Button>
          </div>
        )}
        {couponValid === true && <p className="text-canteen-green text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Coupon applied! You save ₹{discount.toFixed(0)}</p>}
        {couponValid === false && <p className="text-destructive text-xs mt-2">Invalid coupon or minimum order not met</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {coupons.map(c => (
            <Badge key={c.code} variant="outline" className="cursor-pointer text-xs" onClick={() => { setCouponCode(c.code); setCouponValid(null); }}>
              {c.code} - {c.description}
            </Badge>
          ))}
        </div>
      </div>

      {/* Payment Mode */}
      <div className="bg-card rounded-xl border p-4 mb-4">
        <h3 className="font-semibold text-sm mb-2">Payment Mode</h3>
        {noPaymentAvailable ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            Payment is currently unavailable. Please try again later.
          </div>
        ) : (
          <div className="flex gap-3">
            {onlinePaymentEnabled && (
              <button
                onClick={() => setPaymentMode('online')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-semibold ${
                  paymentMode === 'online' ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                }`}
              >
                <CreditCard className="w-5 h-5" /> Online
              </button>
            )}
            {offlinePaymentEnabled && (
              <button
                onClick={() => setPaymentMode('offline')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-semibold ${
                  paymentMode === 'offline' ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                }`}
              >
                <Banknote className="w-5 h-5" /> Cash
              </button>
            )}
          </div>
        )}
        <p className="text-[11px] text-muted-foreground mt-2">We’ll remember this payment choice for faster checkout next time.</p>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-xl border p-4 space-y-2">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal}</span></div>
        {discount > 0 && <div className="flex justify-between text-sm text-canteen-green"><span>Discount</span><span>-₹{discount.toFixed(0)}</span></div>}
        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-gradient">₹{total.toFixed(0)}</span></div>
        <Button
          onClick={handlePrimaryAction}
          disabled={noPaymentAvailable || isPlacingOrder}
          className="w-full gradient-primary text-primary-foreground h-12 text-lg font-bold mt-2"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {isPlacingOrder ? 'Processing...' : paymentMode === 'online' ? 'Pay by QR & Place Order' : 'Place Order'}
        </Button>
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
                  <p className="text-xs text-white/70">Real-time online payment</p>
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

export default CartPage;
