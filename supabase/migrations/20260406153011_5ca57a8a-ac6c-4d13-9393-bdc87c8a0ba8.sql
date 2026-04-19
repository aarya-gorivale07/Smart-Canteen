
-- Menu items table
CREATE TABLE public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'snacks',
  available BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL DEFAULT '',
  calories INTEGER NOT NULL DEFAULT 0,
  protein INTEGER NOT NULL DEFAULT 0,
  fats INTEGER NOT NULL DEFAULT 0,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  is_daily_special BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  token_number INTEGER NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'preparing',
  queue_position INTEGER NOT NULL DEFAULT 1,
  estimated_time INTEGER NOT NULL DEFAULT 10,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_mode TEXT NOT NULL DEFAULT 'offline',
  coupon_applied TEXT,
  discount NUMERIC NOT NULL DEFAULT 0,
  rating INTEGER,
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL,
  menu_item_name TEXT NOT NULL,
  menu_item_price NUMERIC NOT NULL,
  menu_item_image TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1
);

-- Disable RLS for now (app uses custom auth, not Supabase auth)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public access policies (since app uses custom auth)
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public write menu_items" ON public.menu_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public write orders" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read order_items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public write order_items" ON public.order_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Seed menu items
INSERT INTO public.menu_items (id, name, price, category, available, image, calories, protein, fats, is_veg, is_daily_special, description) VALUES
('b1', 'Masala Dosa', 50, 'breakfast', true, 'https://images.unsplash.com/photo-1668236543090-82eb5eace6d8?w=400&h=300&fit=crop&q=80', 250, 6, 8, true, false, 'Crispy dosa with potato masala'),
('b2', 'Idli Sambar', 35, 'breakfast', true, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop&q=80', 180, 5, 3, true, false, 'Steamed rice cakes with sambar'),
('b3', 'Poha', 30, 'breakfast', true, 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop&q=80', 200, 4, 5, true, false, 'Flattened rice with peanuts & spices'),
('b4', 'Upma', 30, 'breakfast', true, 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop&q=80', 220, 5, 6, true, false, 'Semolina cooked with vegetables'),
('b5', 'Aloo Paratha', 45, 'breakfast', true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80', 300, 7, 12, true, false, 'Stuffed potato flatbread with curd'),
('b6', 'Bread Omelette', 40, 'breakfast', true, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop&q=80', 280, 14, 15, false, false, 'Fluffy omelette with toasted bread'),
('b7', 'Vada Pav', 25, 'breakfast', true, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80', 290, 5, 14, true, true, 'Mumbai-style spicy potato fritter burger'),
('b8', 'Medu Vada', 35, 'breakfast', true, 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop&q=80', 240, 8, 10, true, false, 'Crispy lentil donuts with chutney'),
('b9', 'Puri Bhaji', 45, 'breakfast', true, 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop&q=80', 350, 8, 16, true, false, 'Fried bread with spiced potato curry'),
('b10', 'Egg Bhurji', 40, 'breakfast', true, 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop&q=80', 260, 16, 18, false, false, 'Spiced scrambled eggs Indian style'),
('b11', 'Curd Rice', 30, 'breakfast', true, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&q=80', 180, 5, 4, true, false, 'Cool yogurt rice with tempering'),
('b12', 'Rava Dosa', 45, 'breakfast', true, 'https://images.unsplash.com/photo-1668236543090-82eb5eace6d8?w=400&h=300&fit=crop&q=80', 230, 5, 9, true, false, 'Crispy semolina dosa with onions'),
('l1', 'Veg Thali', 90, 'lunch', true, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80', 550, 15, 18, true, true, 'Complete meal with roti, rice, dal, sabzi'),
('l2', 'Chicken Biryani', 120, 'lunch', true, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&q=80', 450, 25, 15, false, false, 'Aromatic rice with spiced chicken'),
('l3', 'Paneer Butter Masala', 100, 'lunch', true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&q=80', 380, 18, 22, true, false, 'Cottage cheese in rich tomato gravy'),
('l4', 'Dal Rice', 60, 'lunch', true, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&q=80', 350, 12, 8, true, false, 'Yellow dal with steamed rice'),
('l5', 'Chole Bhature', 70, 'lunch', true, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop&q=80', 450, 14, 20, true, false, 'Spicy chickpeas with fried bread'),
('l6', 'Rajma Chawal', 65, 'lunch', true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80', 400, 15, 10, true, false, 'Kidney bean curry with rice'),
('l7', 'Egg Curry Rice', 75, 'lunch', true, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80', 380, 18, 14, false, false, 'Spiced egg curry with steamed rice'),
('l8', 'Chicken Fried Rice', 100, 'lunch', true, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80', 420, 22, 16, false, false, 'Wok-tossed rice with chicken & veggies'),
('l9', 'Veg Pulao', 60, 'lunch', true, 'https://images.unsplash.com/photo-1536304993881-460e97feca79?w=400&h=300&fit=crop&q=80', 320, 8, 10, true, false, 'Fragrant rice with mixed vegetables'),
('l10', 'Pav Bhaji', 60, 'lunch', true, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80', 350, 10, 14, true, false, 'Spiced mashed veggies with butter pav'),
('l11', 'Mutton Curry Rice', 150, 'lunch', true, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80', 520, 30, 22, false, false, 'Slow-cooked mutton in rich gravy'),
('l12', 'Kadhi Chawal', 55, 'lunch', true, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&q=80', 340, 10, 12, true, false, 'Yogurt curry with pakoras and rice'),
('l13', 'Butter Chicken', 130, 'lunch', true, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop&q=80', 490, 28, 24, false, true, 'Creamy tomato chicken with naan'),
('l14', 'Aloo Gobi', 65, 'lunch', true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80', 280, 7, 12, true, false, 'Spiced potato & cauliflower dry curry'),
('s1', 'Samosa', 15, 'snacks', true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80', 150, 3, 8, true, false, 'Crispy pastry with potato filling'),
('s2', 'Pani Puri', 30, 'snacks', true, 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&h=300&fit=crop&q=80', 120, 2, 4, true, false, '6 pieces of tangy water-filled puris'),
('s3', 'French Fries', 50, 'snacks', true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&q=80', 320, 4, 17, true, false, 'Crispy golden potato fries'),
('s4', 'Veg Sandwich', 40, 'snacks', true, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&q=80', 250, 8, 10, true, false, 'Grilled sandwich with veggies & cheese'),
('s5', 'Spring Rolls', 45, 'snacks', true, 'https://images.unsplash.com/photo-1548507200-dc0e4032275a?w=400&h=300&fit=crop&q=80', 200, 5, 10, true, false, 'Crispy rolls with veggie filling'),
('s6', 'Chicken Momos', 60, 'snacks', false, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&q=80', 280, 16, 12, false, false, 'Steamed dumplings with chicken filling'),
('s7', 'Bhel Puri', 25, 'snacks', true, 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=400&h=300&fit=crop&q=80', 180, 4, 5, true, false, 'Puffed rice with chutneys & veggies'),
('s8', 'Cheese Pizza Slice', 55, 'snacks', true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80', 280, 12, 14, true, true, 'Loaded cheese pizza slice'),
('s9', 'Veg Momos', 50, 'snacks', true, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&q=80', 220, 6, 8, true, false, 'Steamed veggie dumplings with chutney'),
('s10', 'Aloo Tikki', 20, 'snacks', true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80', 180, 4, 9, true, false, 'Crispy potato patties with chutney'),
('s11', 'Chicken Roll', 65, 'snacks', true, 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&h=300&fit=crop&q=80', 320, 18, 14, false, false, 'Chicken wrapped in flaky paratha'),
('s12', 'Paneer Roll', 55, 'snacks', true, 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&h=300&fit=crop&q=80', 290, 14, 16, true, false, 'Spiced paneer wrapped in paratha'),
('s13', 'Dabeli', 20, 'snacks', true, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80', 220, 4, 8, true, false, 'Sweet & spicy Kutchi snack in pav'),
('s14', 'Onion Pakora', 20, 'snacks', true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80', 190, 3, 11, true, false, 'Crispy onion fritters with chutney'),
('d1', 'Masala Chai', 15, 'beverages', true, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80', 80, 2, 3, true, false, 'Traditional spiced Indian tea'),
('d2', 'Filter Coffee', 20, 'beverages', true, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&q=80', 60, 1, 2, true, false, 'South Indian style filter coffee'),
('d3', 'Mango Lassi', 40, 'beverages', true, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&q=80', 180, 5, 4, true, false, 'Sweet mango yogurt drink'),
('d4', 'Cold Coffee', 50, 'beverages', true, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80', 200, 4, 8, true, false, 'Chilled coffee with ice cream'),
('d5', 'Fresh Lime Soda', 30, 'beverages', true, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&h=300&fit=crop&q=80', 70, 0, 0, true, false, 'Refreshing lime with soda'),
('d6', 'Buttermilk', 20, 'beverages', true, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&q=80', 50, 3, 1, true, false, 'Spiced yogurt drink'),
('d7', 'Orange Juice', 45, 'beverages', true, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&q=80', 110, 1, 0, true, false, 'Freshly squeezed orange juice'),
('d8', 'Watermelon Juice', 35, 'beverages', true, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop&q=80', 90, 1, 0, true, false, 'Fresh watermelon juice'),
('d9', 'Hot Chocolate', 55, 'beverages', true, 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400&h=300&fit=crop&q=80', 220, 5, 10, true, false, 'Rich creamy hot chocolate'),
('d10', 'Banana Shake', 45, 'beverages', true, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop&q=80', 190, 6, 5, true, false, 'Thick banana milkshake'),
('d11', 'Strawberry Smoothie', 55, 'beverages', true, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop&q=80', 170, 4, 3, true, true, 'Fresh strawberry blended smoothie'),
('d12', 'Iced Tea', 35, 'beverages', true, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80', 60, 0, 0, true, false, 'Chilled lemon iced tea');
