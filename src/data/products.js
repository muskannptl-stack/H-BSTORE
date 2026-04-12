export const products = [
  // Grocery
  { id: 1, name: "Premium Basmati Rice", price: 150, category: "Grocery", image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80", description: "Long grain premium quality basmati rice. Perfect for daily consumption and special occasions." },
  { id: 2, name: "Refined Sunflower Oil 1L", price: 120, category: "Grocery", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80", description: "Healthy refined sunflower oil enriched with vitamins." },
  { id: 3, name: "Brown Sugar 1kg", price: 60, category: "Grocery", image: "https://images.unsplash.com/photo-1581428982868-e410dd1cbf76?w=500&q=80", description: "Natural unrefined brown sugar for a healthier alternative." },
  
  // Drinks
  { id: 6, name: "Coca Cola Pack of 6", price: 240, category: "Drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80", description: "Refreshing classic Coca Cola cans." },
  { id: 7, name: "Real Orange Juice 1L", price: 110, category: "Drinks", image: "https://images.unsplash.com/photo-1613478881439-d2b3882f0732?w=500&q=80", description: "100% natural orange juice, no added preservatives." },
  { id: 8, name: "Cold Coffee Iced Mocha", price: 85, category: "Drinks", image: "https://images.unsplash.com/photo-1461023058943-07cb14c4e53e?w=500&q=80", description: "Premium iced mocha ready to drink." },
  
  // Snacks
  { id: 10, name: "Lays Classic Salted", price: 20, category: "Snacks", image: "https://images.unsplash.com/photo-1566478989037-eade3f7ceabe?w=500&q=80", description: "Crunchy potato chips sprinkled with salt." },
  { id: 11, name: "Oreo Choco Creme", price: 35, category: "Snacks", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80", description: "Chocolate sandwich biscuits with choco creme." },
  { id: 12, name: "Roasted Almonds 200g", price: 220, category: "Snacks", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&q=80", description: "Premium quality roasted almonds." },
  
  // Fruits
  { id: 14, name: "Fresh Apples 1kg", price: 180, category: "Fruits", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcc6?w=500&q=80", description: "Crisp, sweet and juicy red apples." },
  { id: 15, name: "Robusta Banana 500g", price: 35, category: "Fruits", image: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=500&q=80", description: "Fresh and ripe Robusta bananas." },
  
  // Vegetables
  { id: 18, name: "Fresh Red Tomatoes 1kg", price: 40, category: "Vegetables", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80", description: "Farm fresh organic red tomatoes." },
  { id: 19, name: "Organic Potatoes 2kg", price: 50, category: "Vegetables", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80", description: "Freshly harvested potatoes, perfect for daily cooking." },
  { id: 20, name: "Green Capsicum 500g", price: 60, category: "Vegetables", image: "https://images.unsplash.com/photo-1597330752813-f432de782f28?w=500&q=80", description: "Crispy and fresh green capsicum/bell peppers." },

  // Dairy
  { id: 21, name: "Full Cream Milk 1L", price: 66, category: "Dairy", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80", description: "Fresh full cream milk packed with nutrition." },
  { id: 22, name: "Fresh Paneer 200g", price: 85, category: "Dairy", image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&q=80", description: "Soft and fresh malai paneer." },
  { id: 23, name: "Salted Butter 100g", price: 56, category: "Dairy", image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&q=80", description: "Classic salted table butter." },

  // Bakery
  { id: 24, name: "Whole Wheat Bread", price: 45, category: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", description: "Freshly baked 100% whole wheat bread loaf." },
  { id: 25, name: "Chocolate Croissant", price: 70, category: "Bakery", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&q=80", description: "Flaky french pastry filled with rich dark chocolate." },
  { id: 26, name: "Burger Buns Pack of 4", price: 30, category: "Bakery", image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=500&q=80", description: "Soft sesame-topped burger buns." },

  // Personal Care
  { id: 27, name: "Moisturizing Soap x4", price: 120, category: "Personal Care", image: "https://images.unsplash.com/photo-1600857062241-9c6a086b9fca?w=500&q=80", description: "Gentle moisturizing soap with aloe extracts." },
  { id: 28, name: "Anti-Dandruff Shampoo", price: 180, category: "Personal Care", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80", description: "Cool menthol anti-dandruff shampoo." },
  { id: 29, name: "Charcoal Face Wash", price: 150, category: "Personal Care", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80", description: "Deep cleansing charcoal face wash for glowing skin." },

  // Household
  { id: 30, name: "Liquid Dishwash 500ml", price: 90, category: "Household", image: "https://images.unsplash.com/photo-1584820927498-cafe4c153b8f?w=500&q=80", description: "Lemon powered powerful grease remover dishwash gel." },
  { id: 31, name: "Surface Disinfectant", price: 110, category: "Household", image: "https://images.unsplash.com/photo-1584813470613-5bb534ecb954?w=500&q=80", description: "Kills 99.9% germs on all surfaces." },
  { id: 32, name: "Trash Bags Pack of 30", price: 65, category: "Household", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80", description: "Durable and leak-proof garbage bags." },
];
