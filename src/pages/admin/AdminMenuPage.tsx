import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { MenuItem } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Sparkles, CheckSquare, SquareCheckBig, BadgePercent } from 'lucide-react';

const emptyItem: Omit<MenuItem, 'id'> = {
  name: '', price: 0, category: 'snacks', available: true, image: '', calories: 0, protein: 0, fats: 0, isVeg: true, isDailySpecial: false, description: '',
};

const AdminMenuPage = () => {
  const { menuItems, setMenuItems } = useApp();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>(emptyItem);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState<MenuItem['category']>('snacks');
  const [bulkDiscount, setBulkDiscount] = useState(0);

  const openAdd = () => { setEditing(null); setForm(emptyItem); setDialogOpen(true); };
  const openEdit = (item: MenuItem) => { setEditing(item); setForm(item); setDialogOpen(true); };

  const visibleItems = useMemo(
    () => menuItems.filter(item => categoryFilter === 'all' || item.category === categoryFilter),
    [menuItems, categoryFilter],
  );

  const save = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      setMenuItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setMenuItems(prev => [...prev, { ...form, id: `item-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => setMenuItems(prev => prev.filter(i => i.id !== id));
  const toggleAvail = (id: string) => setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  const toggleSpecial = (id: string) => setMenuItems(prev => prev.map(i => i.id === id ? { ...i, isDailySpecial: !i.isDailySpecial } : i));
  const toggleSelection = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  const clearSelection = () => setSelectedIds([]);
  const selectVisible = () => setSelectedIds(visibleItems.map(item => item.id));
  const bulkSetCategory = () => {
    if (selectedIds.length === 0) return;
    setMenuItems(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, category: bulkCategory } : item));
  };
  const bulkToggleAvailability = () => {
    if (selectedIds.length === 0) return;
    setMenuItems(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, available: !item.available } : item));
  };
  const bulkApplyDiscount = () => {
    if (selectedIds.length === 0 || !bulkDiscount) return;
    setMenuItems(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, price: Math.max(1, Math.round(item.price * (1 - bulkDiscount / 100))) } : item));
  };

  return (
    <div className="container py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-gradient">Manage Menu</h1>
        <Button onClick={openAdd} className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between rounded-xl border bg-card p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">Filter:</span>
          {(['all', 'breakfast', 'lunch', 'snacks', 'beverages'] as const).map(category => (
            <Badge key={category} variant={categoryFilter === category ? 'default' : 'outline'} className="cursor-pointer capitalize" onClick={() => setCategoryFilter(category)}>
              {category}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectVisible} className="gap-1"><CheckSquare className="w-4 h-4" /> Select visible</Button>
          <Button variant="outline" size="sm" onClick={clearSelection} className="gap-1"><SquareCheckBig className="w-4 h-4" /> Clear</Button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border bg-card p-3">
          <div>
            <Label className="text-xs text-muted-foreground">Bulk category</Label>
            <Select value={bulkCategory} onValueChange={v => setBulkCategory(v as MenuItem['category'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
              </SelectContent>
            </Select>
            <Button className="mt-2 w-full" variant="outline" onClick={bulkSetCategory}>Apply category to selected</Button>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Bulk availability</Label>
            <Button className="mt-2 w-full" variant="outline" onClick={bulkToggleAvailability}>Toggle availability on selected</Button>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Bulk discount %</Label>
            <Input type="number" min="0" max="90" value={bulkDiscount} onChange={e => setBulkDiscount(Number(e.target.value))} />
            <Button className="mt-2 w-full gap-2" variant="outline" onClick={bulkApplyDiscount}><BadgePercent className="w-4 h-4" /> Apply discount</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
            <Card className={`${!item.available ? 'opacity-60' : ''} ${selectedIds.includes(item.id) ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-3 flex gap-3">
                <button type="button" onClick={() => toggleSelection(item.id)} className="mt-1 text-muted-foreground">
                  {selectedIds.includes(item.id) ? <CheckSquare className="w-5 h-5 text-primary" /> : <SquareCheckBig className="w-5 h-5" />}
                </button>
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    {item.isDailySpecial && <Sparkles className="w-3 h-3 text-accent" />}
                  </div>
                  <p className="text-sm text-gradient font-bold">₹{item.price}</p>
                  <Badge variant="outline" className="text-xs capitalize">{item.category}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <Switch checked={item.available} onCheckedChange={() => toggleAvail(item.id)} />
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => toggleSpecial(item.id)} title="Toggle daily special">
                    <Sparkles className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(item)}><Pencil className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => remove(item.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as MenuItem['category'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="snacks">Snacks</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Image URL</Label><Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Calories</Label><Input type="number" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: +e.target.value }))} /></div>
              <div><Label>Protein (g)</Label><Input type="number" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: +e.target.value }))} /></div>
              <div><Label>Fats (g)</Label><Input type="number" value={form.fats} onChange={e => setForm(f => ({ ...f, fats: +e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={form.isVeg} onCheckedChange={v => setForm(f => ({ ...f, isVeg: v }))} /><Label>Vegetarian</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.isDailySpecial} onCheckedChange={v => setForm(f => ({ ...f, isDailySpecial: v }))} /><Label>Daily Special</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.available} onCheckedChange={v => setForm(f => ({ ...f, available: v }))} /><Label>Available</Label></div>
            </div>
            <Button onClick={save} className="w-full gradient-primary text-primary-foreground">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMenuPage;
