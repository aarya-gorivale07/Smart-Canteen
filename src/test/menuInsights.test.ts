import { describe, expect, it } from 'vitest';
import type { MenuItem } from '@/data/menuData';
import type { Order } from '@/context/AppContext';
import {
  filterAndSortMenu,
  getAverageRatings,
  getMostLovedItems,
  getOrderItemCounts,
  getTopMenuItemsByOrders,
} from '@/lib/menuInsights';

const makeItem = (overrides: Partial<MenuItem>): MenuItem => ({
  id: 'item-1',
  name: 'Masala Dosa',
  price: 50,
  category: 'breakfast',
  available: true,
  image: 'https://example.com/item.jpg',
  calories: 250,
  protein: 6,
  fats: 8,
  isVeg: true,
  description: 'Test item',
  ...overrides,
});

const makeOrder = (overrides: Partial<Order>): Order => ({
  id: 'order-1',
  items: [
    {
      item: makeItem({ id: 'item-1', name: 'Masala Dosa', category: 'breakfast' }),
      quantity: 2,
    },
  ],
  total: 100,
  status: 'completed',
  tokenNumber: 101,
  queuePosition: 1,
  estimatedTime: 12,
  placedAt: new Date('2026-04-01T10:00:00.000Z'),
  paymentMode: 'online',
  discount: 0,
  ...overrides,
});

describe('menuInsights', () => {
  const menuItems: MenuItem[] = [
    makeItem({ id: 'item-1', name: 'Masala Dosa', price: 50, calories: 250, isDailySpecial: true }),
    makeItem({ id: 'item-2', name: 'Veg Thali', price: 120, category: 'lunch', calories: 550 }),
    makeItem({ id: 'item-3', name: 'Bhel Puri', price: 25, category: 'snacks', calories: 180, isVeg: true }),
  ];

  const orders: Order[] = [
    makeOrder({
      id: 'order-1',
      rating: 5,
      items: [
        { item: menuItems[0], quantity: 2 },
        { item: menuItems[2], quantity: 1 },
      ],
    }),
    makeOrder({
      id: 'order-2',
      rating: 4,
      items: [{ item: menuItems[1], quantity: 1 }],
    }),
    makeOrder({
      id: 'order-3',
      status: 'preparing',
      items: [{ item: menuItems[0], quantity: 3 }],
    }),
  ];

  it('filters and sorts by price and category', () => {
    const orderCounts = getOrderItemCounts(orders);
    const ratings = getAverageRatings(orders);
    const result = filterAndSortMenu(
      menuItems,
      { search: '', category: 'all', vegOnly: false, maxPrice: 60, bestsellerOnly: false, highRatedOnly: false },
      'price-low',
      orderCounts,
      ratings,
    );

    expect(result.map(item => item.id)).toEqual(['item-3', 'item-1']);
  });

  it('identifies top and loved items from orders and reviews', () => {
    const orderCounts = getOrderItemCounts(orders);
    const ratings = getAverageRatings(orders);

    expect(getTopMenuItemsByOrders(menuItems, orderCounts, 2).map(item => item.id)).toEqual(['item-1', 'item-2']);
    expect(getMostLovedItems(menuItems, ratings, 2).map(entry => entry.item.id)).toEqual(['item-1', 'item-3']);
  });

  it('applies bestseller and high-rated filters', () => {
    const orderCounts = getOrderItemCounts(orders);
    const ratings = getAverageRatings(orders);

    const bestseller = filterAndSortMenu(
      menuItems,
      { search: '', category: 'all', vegOnly: false, maxPrice: 200, bestsellerOnly: true, highRatedOnly: false },
      'recommended',
      orderCounts,
      ratings,
    );

    expect(bestseller.map(item => item.id)).toEqual(['item-1']);

    const highRated = filterAndSortMenu(
      menuItems,
      { search: '', category: 'all', vegOnly: false, maxPrice: 200, bestsellerOnly: false, highRatedOnly: true },
      'recommended',
      orderCounts,
      ratings,
    );

    expect(highRated.map(item => item.id)).toEqual(['item-1', 'item-2', 'item-3']);
  });
});
