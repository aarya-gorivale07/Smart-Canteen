import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/data/menuData';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Flame, Sparkles, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const MenuCard = ({ item, index }: MenuCardProps) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useApp();
  const cartItem = cart.find(c => c.item.id === item.id);
  const quantity = cartItem?.quantity || 0;
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'hot'>('medium');
  const [notes, setNotes] = useState('');

  const resetCustomization = () => {
    setCustomizeOpen(false);
    setSpiceLevel('medium');
    setNotes('');
  };

  const handleAdd = (useCustomization: boolean) => {
    addToCart(item, useCustomization ? { spiceLevel, notes: notes.trim() || undefined } : undefined);
    resetCustomization();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ y: -8, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="bg-card rounded-2xl overflow-hidden border group card-elevated card-hover-lift relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: '0 0 30px hsl(4 90% 58% / 0.1), 0 0 60px hsl(28 100% 55% / 0.05)' }}
      />

      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-foreground/10 to-transparent" />

        <AnimatePresence>
          {item.isDailySpecial && (
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
            >
              <Badge className="absolute top-2.5 left-2.5 gradient-hero text-primary-foreground border-0 gap-1 shadow-lg animate-pulse-soft backdrop-blur-sm">
                <Sparkles className="w-3 h-3" /> Daily Special
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {!item.available && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1, rotate: [-3, 3, 0] }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-primary-foreground font-bold text-lg bg-destructive/90 px-5 py-1.5 rounded-full shadow-lg"
            >
              Sold Out
            </motion.span>
          </motion.div>
        )}

        <div className="absolute top-2.5 right-2.5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.15, type: 'spring', stiffness: 400 }}
          >
            {item.isVeg ? (
              <div className="w-6 h-6 border-2 border-canteen-green rounded flex items-center justify-center bg-card/90 backdrop-blur-sm shadow-sm">
                <div className="w-3 h-3 rounded-full bg-canteen-green" />
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-destructive rounded flex items-center justify-center bg-card/90 backdrop-blur-sm shadow-sm">
                <div className="w-3 h-3 rounded-full bg-destructive" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Price tag overlay */}
        <div className="absolute bottom-2 left-2">
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.25 }}
            className="text-lg font-bold text-primary-foreground drop-shadow-lg"
          >
            ₹{item.price}
          </motion.span>
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="font-bold text-card-foreground truncate text-sm">{item.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>

        <div className="mt-2 rounded-xl bg-muted/40 border border-border/40 p-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Nutrition</p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-0.5 bg-background/80 px-1.5 py-0.5 rounded-md justify-center">
              <Flame className="w-3 h-3 text-secondary" />{item.calories} cal
            </span>
            <span className="bg-background/80 px-1.5 py-0.5 rounded-md text-center">P {item.protein}g</span>
            <span className="bg-background/80 px-1.5 py-0.5 rounded-md text-center">F {item.fats}g</span>
          </div>
        </div>

        <div className="flex items-center justify-end mt-3">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.div
                key="add-btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Button
                  size="sm"
                  disabled={!item.available}
                  onClick={() => setCustomizeOpen(true)}
                  className="gradient-primary text-primary-foreground h-8 px-4 gap-1 shadow-md hover:shadow-lg hover:brightness-110 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="qty-controls"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center gap-0 bg-primary/10 rounded-xl overflow-hidden border border-primary/20 shadow-sm"
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, quantity - 1)}
                  className="h-8 w-8 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-8 w-8 flex items-center justify-center text-sm font-bold text-primary"
                >
                  {quantity}
                </motion.span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={customizeOpen} onOpenChange={(open) => open ? setCustomizeOpen(true) : resetCustomization()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Customize {item.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Spice level</label>
              <Select value={spiceLevel} onValueChange={(value) => setSpiceLevel(value as 'mild' | 'medium' | 'hot')}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium">Special notes</label>
              <Textarea
                className="mt-1"
                placeholder="Extra chutney, no onions, extra crispy..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1 gap-1" onClick={() => handleAdd(false)}>
                Quick Add <ChevronRight className="w-4 h-4" />
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground gap-1" onClick={() => handleAdd(true)}>
                Add Customized <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MenuCard;
