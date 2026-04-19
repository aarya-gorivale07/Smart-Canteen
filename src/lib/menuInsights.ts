import type { MenuItem } from '@/data/menuData';
import type { Order } from '@/context/AppContext';

export type MenuSort = 'recommended' | 'price-low' | 'price-high' | 'popular' | 'rating' | 'lighter';

export interface MenuFilters {
  search: string;
  category: string;
  vegOnly: boolean;
  maxPrice: number;
  bestsellerOnly: boolean;
  highRatedOnly: boolean;
}

export const getOrderItemCounts = (orders: Order[]) => {
  const counts = new Map<string, number>();
  orders.forEach((order) => {
    order.items.forEach((orderItem) => {
      const prev = counts.get(orderItem.item.id) ?? 0;
      counts.set(orderItem.item.id, prev + orderItem.quantity);
    });
  });
  return counts;
};

export const getAverageRatings = (orders: Order[]) => {
  const ratings = new Map<string, { total: number; count: number }>();

  orders.forEach((order) => {
    if (!order.rating) {
      return;
    }

    order.items.forEach((orderItem) => {
      const stat = ratings.get(orderItem.item.id) ?? { total: 0, count: 0 };
      stat.total += order.rating;
      stat.count += 1;
      ratings.set(orderItem.item.id, stat);
    });
  });

  return ratings;
};

export const getAverageRatingForItem = (
  itemId: string,
  ratings: Map<string, { total: number; count: number }>,
) => {
  const stat = ratings.get(itemId);
  if (!stat || stat.count === 0) {
    return 0;
  }
  return stat.total / stat.count;
};

export const filterAndSortMenu = (
  items: MenuItem[],
  filters: MenuFilters,
  sortBy: MenuSort,
  orderCounts: Map<string, number>,
  ratings: Map<string, { total: number; count: number }>,
) => {
  const filtered = items.filter((item) => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.vegOnly && !item.isVeg) return false;
    if (item.price > filters.maxPrice) return false;
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.bestsellerOnly && (orderCounts.get(item.id) ?? 0) < 5) return false;
    if (filters.highRatedOnly && getAverageRatingForItem(item.id, ratings) < 4) return false;
    return true;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'popular') return (orderCounts.get(b.id) ?? 0) - (orderCounts.get(a.id) ?? 0);
    if (sortBy === 'rating') return getAverageRatingForItem(b.id, ratings) - getAverageRatingForItem(a.id, ratings);
    if (sortBy === 'lighter') return a.calories - b.calories;

    const specialDiff = Number(Boolean(b.isDailySpecial)) - Number(Boolean(a.isDailySpecial));
    if (specialDiff !== 0) return specialDiff;

    return (orderCounts.get(b.id) ?? 0) - (orderCounts.get(a.id) ?? 0);
  });
};

export const getTopMenuItemsByOrders = (
  items: MenuItem[],
  orderCounts: Map<string, number>,
  limit = 4,
) => {
  return [...items]
    .sort((a, b) => (orderCounts.get(b.id) ?? 0) - (orderCounts.get(a.id) ?? 0))
    .filter((item) => (orderCounts.get(item.id) ?? 0) > 0)
    .slice(0, limit);
};

export const getMostLovedItems = (
  items: MenuItem[],
  ratings: Map<string, { total: number; count: number }>,
  limit = 4,
) => {
  return [...items]
    .map((item) => ({
      item,
      rating: getAverageRatingForItem(item.id, ratings),
      ratingCount: ratings.get(item.id)?.count ?? 0,
    }))
    .filter((entry) => entry.ratingCount > 0)
    .sort((a, b) => {
      if (b.rating === a.rating) return b.ratingCount - a.ratingCount;
      return b.rating - a.rating;
    })
    .slice(0, limit);
};
