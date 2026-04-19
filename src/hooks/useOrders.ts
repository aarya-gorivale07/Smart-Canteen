import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order, CartItem, ItemCustomization } from '@/context/AppContext';

interface DbOrder {
  id: string;
  token_number: number;
  total: number;
  status: string;
  queue_position: number;
  estimated_time: number;
  placed_at: string;
  payment_mode: string;
  coupon_applied: string | null;
  discount: number;
  rating: number | null;
  review: string | null;
}

interface OrderMeta {
  orderedBy?: string;
  orderedFor?: string;
  itemCustomizations?: Record<string, ItemCustomization>;
}

interface DbOrderItem {
  menu_item_id: string;
  menu_item_name: string;
  menu_item_price: number;
  menu_item_image: string;
  quantity: number;
}

const META_KEY = 'ub-order-metadata';

const loadOrderMeta = (): Record<string, OrderMeta> => {
  const saved = localStorage.getItem(META_KEY);
  if (!saved) return {};
  try {
    const parsed = JSON.parse(saved) as Record<string, OrderMeta>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const saveOrderMeta = (meta: Record<string, OrderMeta>) => {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
};

const toOrder = (row: DbOrder, items: DbOrderItem[], meta?: OrderMeta): Order => ({
  id: row.id,
  items: items.map(oi => ({
    item: {
      id: oi.menu_item_id,
      name: oi.menu_item_name,
      price: Number(oi.menu_item_price),
      image: oi.menu_item_image,
      category: 'snacks' as const,
      available: true,
      calories: 0,
      protein: 0,
      fats: 0,
      isVeg: true,
      description: '',
    },
    quantity: oi.quantity,
    customization: meta?.itemCustomizations?.[oi.menu_item_id],
  })),
  total: Number(row.total),
  status: row.status as Order['status'],
  tokenNumber: row.token_number,
  queuePosition: row.queue_position,
  estimatedTime: row.estimated_time,
  placedAt: new Date(row.placed_at),
  paymentMode: row.payment_mode as 'online' | 'offline',
  couponApplied: row.coupon_applied ?? undefined,
  discount: Number(row.discount),
  rating: row.rating ?? undefined,
  review: row.review ?? undefined,
  orderedBy: meta?.orderedBy,
  orderedFor: meta?.orderedFor,
});

export const useOrders = () => {
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('placed_at', { ascending: false });

    if (!ordersData) { setLoading(false); return; }

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', ordersData.map(o => o.id));

    const itemsByOrder = new Map<string, DbOrderItem[]>();
    (itemsData ?? []).forEach((oi: any) => {
      const list = itemsByOrder.get(oi.order_id) ?? [];
      list.push(oi);
      itemsByOrder.set(oi.order_id, list);
    });

    const orderMeta = loadOrderMeta();
    setOrdersState(ordersData.map((o: any) => toOrder(o, itemsByOrder.get(o.id) ?? [], orderMeta[o.id])));
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Realtime subscription for order status changes
  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  const saveOrder = useCallback(async (order: Order) => {
    await supabase.from('orders').insert({
      id: order.id,
      token_number: order.tokenNumber,
      total: order.total,
      status: order.status,
      queue_position: order.queuePosition,
      estimated_time: order.estimatedTime,
      placed_at: order.placedAt.toISOString(),
      payment_mode: order.paymentMode,
      coupon_applied: order.couponApplied ?? null,
      discount: order.discount,
    });

    const orderItems = order.items.map(ci => ({
      order_id: order.id,
      menu_item_id: ci.item.id,
      menu_item_name: ci.item.name,
      menu_item_price: ci.item.price,
      menu_item_image: ci.item.image,
      quantity: ci.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);
    if (order.orderedBy || order.orderedFor || order.items.some(item => item.customization)) {
      const meta = loadOrderMeta();
      meta[order.id] = {
        orderedBy: order.orderedBy,
        orderedFor: order.orderedFor,
        itemCustomizations: Object.fromEntries(
          order.items
            .filter(item => item.customization)
            .map(item => [item.item.id, item.customization as ItemCustomization]),
        ),
      };
      saveOrderMeta(meta);
    }
    setOrdersState(prev => [...prev, order]);
  }, []);

  const updateStatus = useCallback(async (orderId: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrdersState(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const updateReview = useCallback(async (orderId: string, rating: number, review: string) => {
    await supabase.from('orders').update({ rating, review }).eq('id', orderId);
    setOrdersState(prev => prev.map(o => o.id === orderId ? { ...o, rating, review } : o));
  }, []);

  return { orders, saveOrder, updateStatus, updateReview, loading };
};
