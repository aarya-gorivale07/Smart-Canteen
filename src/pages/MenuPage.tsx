import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import MenuCard from '@/components/MenuCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Users,
  Leaf,
  Tag,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Star,
  ShoppingCart,
  Trophy,
  Heart,
} from 'lucide-react';
import { coupons } from '@/data/menuData';
import {
  filterAndSortMenu,
  getAverageRatingForItem,
  getAverageRatings,
  getMostLovedItems,
  getOrderItemCounts,
  getTopMenuItemsByOrders,
  MenuSort,
} from '@/lib/menuInsights';

const categories = ['all', 'breakfast', 'lunch', 'snacks', 'beverages'] as const;
const categoryEmoji: Record<string, string> = {
  all: '🍽',
  breakfast: '🌅',
  lunch: '🍛',
  snacks: '🍟',
  beverages: '🥤',
};

const MenuPage = () => {
  const { menuItems, canteenCapacity, currentOccupancy, cart, orders } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<MenuSort>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [highRatedOnly, setHighRatedOnly] = useState(false);
  const navigate = useNavigate();

  const occupancyPct = Math.round((currentOccupancy / canteenCapacity) * 100);
  const occupancyColor = occupancyPct > 80 ? 'text-destructive' : occupancyPct > 50 ? 'text-warning' : 'text-canteen-green';

  const orderCounts = useMemo(() => getOrderItemCounts(orders), [orders]);
  const ratings = useMemo(() => getAverageRatings(orders), [orders]);

  const filtered = useMemo(
    () =>
      filterAndSortMenu(
        menuItems,
        { search, category, vegOnly, maxPrice, bestsellerOnly, highRatedOnly },
        sortBy,
        orderCounts,
        ratings,
      ),
    [menuItems, search, category, vegOnly, maxPrice, bestsellerOnly, highRatedOnly, sortBy, orderCounts, ratings],
  );

  const topDishes = useMemo(() => getTopMenuItemsByOrders(menuItems, orderCounts, 4), [menuItems, orderCounts]);
  const mostLoved = useMemo(() => getMostLovedItems(menuItems, ratings, 4), [menuItems, ratings]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container py-6 px-4 pb-28">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-8 relative overflow-hidden rounded-2xl gradient-hero p-[1px]"
      >
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-50 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Tag className="w-5 h-5 text-primary" />
              </motion.div>
              <h2 className="font-display text-lg text-gradient">Offers & Coupons</h2>
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {coupons.map((coupon, i) => (
                <motion.div
                  key={coupon.code}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="min-w-[190px] glass rounded-xl p-3 flex-shrink-0 cursor-pointer border border-primary/15 hover:border-primary/30 transition-all hover:shadow-md group"
                  onClick={() => handleCopyCoupon(coupon.code)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
                      {coupon.code}
                    </span>
                    <AnimatePresence mode="wait">
                      {copiedCode === coupon.code ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-4 h-4 text-canteen-green" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="opacity-50 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-card-foreground font-semibold">{coupon.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Min order: ₹{coupon.minOrder}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="mb-6 p-4 glass rounded-xl flex items-center justify-between card-elevated"
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Users className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold">Canteen Space</p>
            <p className="text-xs text-muted-foreground">{currentOccupancy}/{canteenCapacity} seats occupied</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-36 h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${occupancyPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <motion.span key={occupancyPct} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className={`text-sm font-bold ${occupancyColor}`}>
            {occupancyPct}%
          </motion.span>
        </div>
      </motion.div>

      {(topDishes.length > 0 || mostLoved.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {topDishes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-warning" />Top Dishes This Week</h3>
              <div className="space-y-2">
                {topDishes.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                    <span className="font-medium">#{idx + 1} {item.name}</span>
                    <span className="text-muted-foreground">{orderCounts.get(item.id)} orders</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {mostLoved.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-primary" />Most Loved (Verified Reviews)</h3>
              <div className="space-y-2">
                {mostLoved.map((entry) => (
                  <div key={entry.item.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                    <span className="font-medium">{entry.item.name}</span>
                    <span className="inline-flex items-center gap-1 text-warning">
                      <Star className="w-3 h-3 fill-warning" />
                      {entry.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 mb-4"
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search your cravings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border/50 focus:border-primary/50 transition-all bg-card/80 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant={vegOnly ? 'default' : 'outline'}
            onClick={() => setVegOnly(!vegOnly)}
            className={vegOnly ? 'gap-1.5 gradient-primary text-primary-foreground' : 'gap-1.5'}
          >
            <Leaf className="w-4 h-4" /> Veg Only
          </Button>
          <Button
            type="button"
            variant={bestsellerOnly ? 'default' : 'outline'}
            onClick={() => setBestsellerOnly(!bestsellerOnly)}
            className={bestsellerOnly ? 'gap-1.5 gradient-primary text-primary-foreground' : 'gap-1.5'}
          >
            <Flame className="w-4 h-4" /> Bestseller
          </Button>
          <Button
            type="button"
            variant={highRatedOnly ? 'default' : 'outline'}
            onClick={() => setHighRatedOnly(!highRatedOnly)}
            className={highRatedOnly ? 'gap-1.5 gradient-primary text-primary-foreground' : 'gap-1.5'}
          >
            <Star className="w-4 h-4" /> 4+ Rated
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-xl border bg-card p-3 mb-6"
      >
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <SlidersHorizontal className="w-4 h-4" /> Discovery Controls
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Sort by</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['recommended', 'Recommended'],
                ['popular', 'Popularity'],
                ['rating', 'Rating'],
                ['price-low', 'Price Low'],
                ['price-high', 'Price High'],
                ['lighter', 'Low Calories'],
              ].map(([value, label]) => (
                <Badge
                  key={value}
                  variant={sortBy === value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSortBy(value as MenuSort)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground mb-2">Max Price: ₹{maxPrice}</p>
            <Slider value={[maxPrice]} min={20} max={250} step={5} onValueChange={([value]) => setMaxPrice(value)} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((cat, i) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
            <Badge
              variant={category === cat ? 'default' : 'outline'}
              className={`cursor-pointer capitalize text-sm px-4 py-2 transition-all duration-300 ${
                category === cat
                  ? 'gradient-primary text-primary-foreground border-0 shadow-md glow-primary'
                  : 'hover:bg-primary/5 hover:border-primary/30'
              }`}
              onClick={() => setCategory(cat)}
            >
              <motion.span whileHover={{ scale: 1.1 }} className="inline-flex items-center gap-1">
                {categoryEmoji[cat]} {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.span>
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {category === 'all' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-5 h-5 text-accent" />
              </motion.div>
              <h2 className="font-display text-xl text-gradient">Today's Specials</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {menuItems.filter(i => i.isDailySpecial).map((item, idx) => (
                <MenuCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-xl mb-4 flex items-center gap-2">
          {category === 'all' ? (
            <>Full Menu <Badge variant="outline" className="text-xs font-normal">{filtered.length} items</Badge></>
          ) : (
            <>
              {categoryEmoji[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
              <Badge variant="outline" className="text-xs font-normal">{filtered.length} items</Badge>
            </>
          )}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={category + (vegOnly ? '-veg' : '') + search + sortBy + maxPrice + String(bestsellerOnly) + String(highRatedOnly)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filtered.map((item, idx) => (
              <div key={item.id}>
                <MenuCard item={item} index={idx} />
                {(orderCounts.get(item.id) ?? 0) > 0 && (
                  <p className="text-[11px] text-muted-foreground mt-1 px-1">
                    Ordered {orderCounts.get(item.id)} times
                    {getAverageRatingForItem(item.id, ratings) > 0 && ` • ${getAverageRatingForItem(item.id, ratings).toFixed(1)}★`}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="text-5xl mb-3 animate-float">🔍</div>
            <p className="text-muted-foreground font-semibold">No items found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting filters or increasing your max price.</p>
          </motion.div>
        )}
      </motion.div>

      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl z-50"
        >
          <div className="rounded-2xl p-1 gradient-primary shadow-xl">
            <div className="rounded-[14px] bg-card/95 backdrop-blur p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{cartCount} item{cartCount > 1 ? 's' : ''} in cart</p>
                <p className="text-xs text-muted-foreground">Total ₹{cartTotal.toFixed(0)}</p>
              </div>
              <Button onClick={() => navigate('/cart')} className="gradient-primary text-primary-foreground gap-2">
                <ShoppingCart className="w-4 h-4" />
                View Cart
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;
