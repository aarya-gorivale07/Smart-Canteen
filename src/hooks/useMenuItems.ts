import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/data/menuData';

const toMenuItem = (row: any): MenuItem => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  category: row.category as MenuItem['category'],
  available: row.available,
  image: row.image,
  calories: row.calories,
  protein: row.protein,
  fats: row.fats,
  isVeg: row.is_veg,
  isDailySpecial: row.is_daily_special,
  description: row.description,
});

const toDbRow = (item: MenuItem) => ({
  id: item.id,
  name: item.name,
  price: item.price,
  category: item.category,
  available: item.available,
  image: item.image,
  calories: item.calories,
  protein: item.protein,
  fats: item.fats,
  is_veg: item.isVeg,
  is_daily_special: item.isDailySpecial ?? false,
  description: item.description,
});

export const useMenuItems = () => {
  const [menuItems, setMenuItemsState] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id');
    if (!error && data) {
      setMenuItemsState(data.map(toMenuItem));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>> = useCallback((updater) => {
    setMenuItemsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Sync to DB in background
      syncMenuToDb(prev, next);
      return next;
    });
  }, []);

  return { menuItems, setMenuItems, loading };
};

async function syncMenuToDb(prev: MenuItem[], next: MenuItem[]) {
  const prevIds = new Set(prev.map(i => i.id));
  const nextIds = new Set(next.map(i => i.id));

  // Deleted items
  const deleted = prev.filter(i => !nextIds.has(i.id));
  if (deleted.length > 0) {
    await supabase.from('menu_items').delete().in('id', deleted.map(i => i.id));
  }

  // Upsert all current items
  const rows = next.map(toDbRow);
  if (rows.length > 0) {
    await supabase.from('menu_items').upsert(rows);
  }
}
