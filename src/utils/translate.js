const translationDict = {
  // Категории
  "fragrances": "Парфюмерия",
  "laptops": "Ноутбуки",
  "mens-watches": "Мужские часы",
  "womens-bags": "Женские сумки",
  "home-decoration": "Декор для дома",
  "groceries": "Продукты",
  "mobile-accessories": "Мобильные аксессуары",
  "kitchen-accessories": "Кухонные принадлежности",
  "skin-care": "Уход за кожей",
  "beauty": "Красота",
  "sunglasses": "Солнцезащитные очки",
  "sports-accessories": "Спортивные аксессуары",
  "mens-shirts": "Мужские рубашки",
  "mens-shoes": "Мужская обувь",
  "womens-dresses": "Женские платья",
  "womens-shoes": "Женская обувь",
  "womens-jewellery": "Женские украшения",
  "womens-watches": "Женские часы",
  "tops": "Топы",

  // Товары
  "Amazon Echo Plus": "Умная колонка Amazon Echo Plus",
  "Huawei Matebook X Pro": "Ноутбук Huawei Matebook X Pro",
  "Rolex Cellini Date Black Dial": "Часы Rolex Cellini Date (черный циферблат)",
  "Water": "Вода питьевая",
  "Mulberry": "Сумка Mulberry",
  "Kiwi": "Киви (фрукт)",
  "Lunch Box": "Ланч-бокс",
  "Heshe Women's Leather Bag": "Женская кожаная сумка Heshe",
  "Calvin Klein Ladies": "Женские духи Calvin Klein",
  "Chanel Coco Noir Eau De": "Духи Chanel Coco Noir",
  "Dior J'adore": "Духи Dior J'adore",
  "Gucci Bloom Eau de": "Духи Gucci Bloom",
  "Apple MacBook Pro 14 Inch Space Grey": "Ноутбук Apple MacBook Pro 14 (серый)",
  "Asus Zenbook Pro Dual Screen Laptop": "Ноутбук Asus Zenbook Pro (два экрана)",
  "Apple AirPods Max Silver": "Наушники Apple AirPods Max (серебристые)",
  "Apple Watch Series 4 Gold": "Умные часы Apple Watch Series 4 (золотые)",
  "Brown Leather Belt Watch": "Кожаные часы-браслет (коричневые)",
  "Blue Women's Handbag": "Синяя женская сумка",
  "Green Crystal Earring": "Серьга с зеленым кристаллом",
  "Tropical Sun Hat": "Тропическая шляпа от солнца",
  "Black Sun Glasses": "Солнцезащитные очки (черные)",
  "Round Silver Frame Sun Glasses": "Солнцезащитные очки (круглая серебристая оправа)",
  "Golden Air Pods": "Золотые наушники AirPods",
  "Mornadi Velvet Bed": "Бархатная кровать Mornadi",
  "Heshe Leather Bag": "Кожаная сумка Heshe",
  "Tree Oil 30ml": "Эфирное масло чайного дерева (30 мл)",
  "Vaseline Men Body and Face Lotion": "Лосьон для тела и лица Vaseline Men",
  "L'Oréal Paris Men Expert": "Крем для лица L'Oréal Paris Men Expert",
  "Fair & Lovely Face Wash": "Очищающее средство для лица Fair & Lovely",
  "Khaki Utility Pant": "Брюки-карго (хаки)",
  "Blue Denim Jacket": "Джинсовая куртка (синяя)",
  "Grey Hoodie": "Серое худи",
  "Running Shoes": "Беговые кроссовки",
  "Annibale Colombo Sofa": "Диван Annibale Colombo",
  "Knives": "Набор ножей",
  "Notebook": "Блокнот",
  "Apple": "Яблоко",
  "Beef Steak": "Стейк из говядины",
  "Cat Food": "Кошачий корм",
  "Chicken Meat": "Куриное мясо",
  "Cooking Oil": "Масло для готовки",
  "Cucumber": "Огурец",
  "Dog Food": "Собачий корм",
  "Eggs": "Яйца",
  "Fish Steak": "Стейк из рыбы",
  "Green Bell Pepper": "Зеленый болгарский перец",
  "Green Chili Pepper": "Зеленый перец чили",
  "Honey Jar": "Банка меда",
  "Ice Cream": "Мороженое",
  "Juice": "Сок",
  "Lemon": "Лимон",
  "Milk": "Молоко",
  "Nescafe Coffee": "Кофе Nescafe",
  "Potatoes": "Картофель",
  "Protein Powder": "Протеиновый порошок",
  "Red Onions": "Красный лук",
  "Rice": "Рис",
  "Soft Drinks": "Безалкогольные напитки",
  "Strawberry": "Клубника",
  "Tissue Paper Box": "Коробка бумажных салфеток",
  "Blue Lipstick": "Синяя помада",
  "Essence Mascara Lash Princess": "Тушь для ресниц Essence",
  "Eyeshadow Palette with Mirror": "Палетка теней с зеркалом",
  "Powder Canister": "Пудра",
  "Red Lipstick": "Красная помада",
  "Red Nail Polish": "Красный лак для ногтей",
  "Chicken Curry": "Куриное карри",
  "Gulab Jamun": "Гулаб джамун",
  "Pasta": "Паста",
  "Pizza": "Пицца",
  "Vegetable Soup": "Овощной суп"
};

const descriptionDict = {
  "The Essence of the Fragrance": "Суть аромата",
  "This is a high quality product": "Это высококачественный товар",
  "Perfect for everyday use": "Идеально подходит для повседневного использования",
  "A wonderful gift for yourself or your loved ones": "Прекрасный подарок для себя или близких",
  "High performance and stylish design": "Высокая производительность и стильный дизайн",
  "Made from premium materials": "Изготовлено из первоклассных материалов",
  "An absolute must-have": "Абсолютный маст-хэв",
  "Experience the ultimate comfort": "Ощутите максимальный комфорт",
  "The perfect blend of style and functionality": "Идеальное сочетание стиля и функциональности"
};

export const translateTitle = (title) => {
  if (!title) return "Без названия";
  if (translationDict[title]) return translationDict[title];
  for (const [eng, rus] of Object.entries(translationDict)) {
    if (title.includes(eng)) return title.replace(eng, rus);
  }
  return title; 
};

export const translateCategory = (cat) => {
  return translationDict[cat] || cat;
};

export const translateDescription = (desc) => {
  if (!desc) return "Описание отсутствует. Отличный выбор для настоящего коллекционера!";
  let translated = desc;
  for (const [eng, rus] of Object.entries(descriptionDict)) {
    translated = translated.replace(new RegExp(eng, 'gi'), rus);
  }
  if (/[a-zA-Z]/.test(translated)) {
    return translated + " (Отличный товар для вашей коллекции. Подробные характеристики уточняйте у оператора.)";
  }
  return translated;
};
