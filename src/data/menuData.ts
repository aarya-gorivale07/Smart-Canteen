export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'snacks' | 'beverages';
  available: boolean;
  image: string;
  calories: number;
  protein: number;
  fats: number;
  isVeg: boolean;
  isDailySpecial?: boolean;
  description: string;
}

export const menuItems: MenuItem[] = [
  // BREAKFAST (12 items)
  { id: 'b1', name: 'Masala Dosa', price: 50, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1668236543090-82eb5eace6d8?w=400&h=300&fit=crop&q=80', calories: 250, protein: 6, fats: 8, isVeg: true, description: 'Golden crisp dosa rolled around a spiced potato masala filling.' },
  { id: 'b2', name: 'Idli Sambar', price: 35, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop&q=80', calories: 180, protein: 5, fats: 3, isVeg: true, description: 'Soft steamed idlis served with hot sambar and chutney.' },
  { id: 'b3', name: 'Poha', price: 30, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop&q=80', calories: 200, protein: 4, fats: 5, isVeg: true, description: 'Light flattened rice cooked with onions, peanuts, and spices.' },
  { id: 'b4', name: 'Upma', price: 30, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop&q=80', calories: 220, protein: 5, fats: 6, isVeg: true, description: 'Warm semolina upma tossed with vegetables and tempering.' },
  { id: 'b5', name: 'Aloo Paratha', price: 45, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80', calories: 300, protein: 7, fats: 12, isVeg: true, description: 'Stuffed potato parathas served hot with curd and butter.' },
  { id: 'b6', name: 'Bread Omelette', price: 40, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop&q=80', calories: 280, protein: 14, fats: 15, isVeg: false, description: 'Fluffy masala omelette paired with toasted bread slices.' },
  { id: 'b7', name: 'Vada Pav', price: 25, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80', calories: 290, protein: 5, fats: 14, isVeg: true, isDailySpecial: true, description: 'Street-style potato fritter tucked into soft pav with chutney.' },
  { id: 'b8', name: 'Medu Vada', price: 35, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop&q=80', calories: 240, protein: 8, fats: 10, isVeg: true, description: 'Crispy lentil vadas with coconut chutney and sambar.' },
  { id: 'b9', name: 'Puri Bhaji', price: 45, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop&q=80', calories: 350, protein: 8, fats: 16, isVeg: true, description: 'Puffed puris served with spiced potato bhaji and pickle.' },
  { id: 'b10', name: 'Egg Bhurji', price: 40, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop&q=80', calories: 260, protein: 16, fats: 18, isVeg: false, description: 'Spiced scrambled eggs with herbs and toasted bread.' },
  { id: 'b11', name: 'Curd Rice', price: 30, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&q=80', calories: 180, protein: 5, fats: 4, isVeg: true, description: 'Cooling curd rice with tempered spices and curry leaves.' },
  { id: 'b12', name: 'Rava Dosa', price: 45, category: 'breakfast', available: true, image: 'https://images.unsplash.com/photo-1668236543090-82eb5eace6d8?w=400&h=300&fit=crop&q=80', calories: 230, protein: 5, fats: 9, isVeg: true, description: 'Thin crisp semolina dosa with onion and spice topping.' },

  // LUNCH (14 items)
  { id: 'l1', name: 'Veg Thali', price: 90, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80', calories: 550, protein: 15, fats: 18, isVeg: true, isDailySpecial: true, description: 'Full vegetarian thali with roti, rice, dal, sabzi, and sides.' },
  { id: 'l2', name: 'Chicken Biryani', price: 120, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&q=80', calories: 450, protein: 25, fats: 15, isVeg: false, description: 'Fragrant layered biryani with tender spiced chicken pieces.' },
  { id: 'l3', name: 'Paneer Butter Masala', price: 100, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&q=80', calories: 380, protein: 18, fats: 22, isVeg: true, description: 'Paneer cubes in a creamy tomato-butter gravy.' },
  { id: 'l4', name: 'Dal Rice', price: 60, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&q=80', calories: 350, protein: 12, fats: 8, isVeg: true, description: 'Simple dal served over steamed rice for a comforting meal.' },
  { id: 'l5', name: 'Chole Bhature', price: 70, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop&q=80', calories: 450, protein: 14, fats: 20, isVeg: true, description: 'Spicy chole with fluffy deep-fried bhature and onion salad.' },
  { id: 'l6', name: 'Rajma Chawal', price: 65, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80', calories: 400, protein: 15, fats: 10, isVeg: true, description: 'Slow-cooked rajma gravy served over fluffy rice.' },
  { id: 'l7', name: 'Egg Curry Rice', price: 75, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80', calories: 380, protein: 18, fats: 14, isVeg: false, description: 'Spiced egg curry plated with steamed rice.' },
  { id: 'l8', name: 'Chicken Fried Rice', price: 100, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80', calories: 420, protein: 22, fats: 16, isVeg: false, description: 'Wok-tossed fried rice with chicken, vegetables, and soy glaze.' },
  { id: 'l9', name: 'Veg Pulao', price: 60, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1536304993881-460e97feca79?w=400&h=300&fit=crop&q=80', calories: 320, protein: 8, fats: 10, isVeg: true, description: 'Aromatic rice pilaf with mixed seasonal vegetables.' },
  { id: 'l10', name: 'Pav Bhaji', price: 60, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80', calories: 350, protein: 10, fats: 14, isVeg: true, description: 'Buttery pav served with a spicy mashed vegetable bhaji.' },
  { id: 'l11', name: 'Mutton Curry Rice', price: 150, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80', calories: 520, protein: 30, fats: 22, isVeg: false, description: 'Rich mutton curry served with rice and gravy.' },
  { id: 'l12', name: 'Kadhi Chawal', price: 55, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&q=80', calories: 340, protein: 10, fats: 12, isVeg: true, description: 'Tangy yogurt kadhi with rice and crisp pakoras.' },
  { id: 'l13', name: 'Butter Chicken', price: 130, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop&q=80', calories: 490, protein: 28, fats: 24, isVeg: false, isDailySpecial: true, description: 'Creamy butter chicken curry served with naan.' },
  { id: 'l14', name: 'Aloo Gobi', price: 65, category: 'lunch', available: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80', calories: 280, protein: 7, fats: 12, isVeg: true, description: 'Dry spiced potato and cauliflower sabzi.' },

  // SNACKS (14 items)
  { id: 's1', name: 'Samosa', price: 15, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80', calories: 150, protein: 3, fats: 8, isVeg: true, description: 'Golden fried triangle pastries filled with spiced potato.' },
  { id: 's2', name: 'Pani Puri', price: 30, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&h=300&fit=crop&q=80', calories: 120, protein: 2, fats: 4, isVeg: true, description: 'Crisp puris served with tangy pani, chutney, and filling.' },
  { id: 's3', name: 'French Fries', price: 50, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&q=80', calories: 320, protein: 4, fats: 17, isVeg: true, description: 'Classic salted golden fries served hot and crispy.' },
  { id: 's4', name: 'Veg Sandwich', price: 40, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&q=80', calories: 250, protein: 8, fats: 10, isVeg: true, description: 'Grilled sandwich packed with fresh vegetables and cheese.' },
  { id: 's5', name: 'Spring Rolls', price: 45, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1548507200-dc0e4032275a?w=400&h=300&fit=crop&q=80', calories: 200, protein: 5, fats: 10, isVeg: true, description: 'Crispy spring rolls filled with seasoned vegetables.' },
  { id: 's6', name: 'Chicken Momos', price: 60, category: 'snacks', available: false, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&q=80', calories: 280, protein: 16, fats: 12, isVeg: false, description: 'Steamed chicken dumplings with dipping chutney.' },
  { id: 's7', name: 'Bhel Puri', price: 25, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=400&h=300&fit=crop&q=80', calories: 180, protein: 4, fats: 5, isVeg: true, description: 'Tangy puffed rice chaat with chutneys and crunchy toppings.' },
  { id: 's8', name: 'Cheese Pizza Slice', price: 55, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80', calories: 280, protein: 12, fats: 14, isVeg: true, isDailySpecial: true, description: 'A cheesy pizza slice with melted topping and crisp crust.' },
  { id: 's9', name: 'Veg Momos', price: 50, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&q=80', calories: 220, protein: 6, fats: 8, isVeg: true, description: 'Soft steamed vegetable momos served with chutney.' },
  { id: 's10', name: 'Aloo Tikki', price: 20, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80', calories: 180, protein: 4, fats: 9, isVeg: true, description: 'Crispy potato patties topped with chutney and spices.' },
  { id: 's11', name: 'Chicken Roll', price: 65, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&h=300&fit=crop&q=80', calories: 320, protein: 18, fats: 14, isVeg: false, description: 'Chicken filling rolled in a flaky paratha wrap.' },
  { id: 's12', name: 'Paneer Roll', price: 55, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&h=300&fit=crop&q=80', calories: 290, protein: 14, fats: 16, isVeg: true, description: 'Spiced paneer stuffed into a soft flaky roll.' },
  { id: 's13', name: 'Dabeli', price: 20, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80', calories: 220, protein: 4, fats: 8, isVeg: true, description: 'Kutchi-style sweet and spicy potato snack in pav.' },
  { id: 's14', name: 'Onion Pakora', price: 20, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80', calories: 190, protein: 3, fats: 11, isVeg: true, description: 'Crispy onion fritters with a warm chutney dip.' },

  // BEVERAGES (12 items)
  { id: 'd1', name: 'Masala Chai', price: 15, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80', calories: 80, protein: 2, fats: 3, isVeg: true, description: 'Hot spiced Indian tea with milk and ginger notes.' },
  { id: 'd2', name: 'Filter Coffee', price: 20, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&q=80', calories: 60, protein: 1, fats: 2, isVeg: true, description: 'South Indian filter coffee with a rich aromatic finish.' },
  { id: 'd3', name: 'Mango Lassi', price: 40, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&q=80', calories: 180, protein: 5, fats: 4, isVeg: true, description: 'Creamy mango yogurt drink served chilled.' },
  { id: 'd4', name: 'Cold Coffee', price: 50, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80', calories: 200, protein: 4, fats: 8, isVeg: true, description: 'Chilled coffee blended smooth and topped creamy.' },
  { id: 'd5', name: 'Fresh Lime Soda', price: 30, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&h=300&fit=crop&q=80', calories: 70, protein: 0, fats: 0, isVeg: true, description: 'Refreshing lime soda with a fizzy citrus kick.' },
  { id: 'd6', name: 'Buttermilk', price: 20, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&q=80', calories: 50, protein: 3, fats: 1, isVeg: true, description: 'Light spiced buttermilk served as a cooling refresher.' },
  { id: 'd7', name: 'Orange Juice', price: 45, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&q=80', calories: 110, protein: 1, fats: 0, isVeg: true, description: 'Freshly squeezed orange juice with bright citrus flavor.' },
  { id: 'd8', name: 'Watermelon Juice', price: 35, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop&q=80', calories: 90, protein: 1, fats: 0, isVeg: true, description: 'Juicy watermelon drink served cool and hydrating.' },
  { id: 'd9', name: 'Hot Chocolate', price: 55, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400&h=300&fit=crop&q=80', calories: 220, protein: 5, fats: 10, isVeg: true, description: 'Rich creamy hot chocolate finished with a smooth foam.' },
  { id: 'd10', name: 'Banana Shake', price: 45, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop&q=80', calories: 190, protein: 6, fats: 5, isVeg: true, description: 'Thick banana milkshake blended smooth and cold.' },
  { id: 'd11', name: 'Strawberry Smoothie', price: 55, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop&q=80', calories: 170, protein: 4, fats: 3, isVeg: true, isDailySpecial: true, description: 'Fresh strawberry smoothie with a bright fruity finish.' },
  { id: 'd12', name: 'Iced Tea', price: 35, category: 'beverages', available: true, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80', calories: 60, protein: 0, fats: 0, isVeg: true, description: 'Chilled lemon iced tea served over ice.' },
];

export const coupons = [
  { code: 'WELCOME5', discount: 5, type: 'percent' as const, minOrder: 50, description: '5% off on first order' },
  { code: 'LUNCH20', discount: 20, type: 'flat' as const, minOrder: 100, description: '₹20 off on lunch orders' },
  { code: 'SNACK15', discount: 15, type: 'percent' as const, minOrder: 40, description: '15% off on snacks' },
  { code: 'UNIVERSAL50', discount: 50, type: 'flat' as const, minOrder: 200, description: '₹50 off on orders above ₹200' },
  { code: 'COMBO30', discount: 30, type: 'flat' as const, minOrder: 150, description: '₹30 off on combo orders above ₹150' },
  { code: 'MORNING10', discount: 10, type: 'flat' as const, minOrder: 30, description: '₹10 off on breakfast orders' },
  { code: 'TREAT25', discount: 25, type: 'percent' as const, minOrder: 120, description: '25% off on orders above ₹120' },
];
