// Словарь для перевода товаров из DummyJSON на русский
const translationDict = {
  // Категории
  "fragrances": "Парфюмерия",
  "laptops": "Ноутбуки",
  "mens-watches": "Мужские часы",
  "womens-bags": "Женские сумки",
  "home-decoration": "Декор для дома",
  "groceries": "Продукты",

  // Товары (основные из выдачи)
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
  "Running Shoes": "Беговые кроссовки"
};

// Словарь для перевода описаний (общие фразы)
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

// Функция перевода названия
export const translateTitle = (title) => {
  if (!title) return "Без названия";
  
  // Ищем точное совпадение в словаре
  if (translationDict[title]) return translationDict[title];
  
  // Если точного совпадения нет, ищем частичное
  for (const [eng, rus] of Object.entries(translationDict)) {
    if (title.includes(eng)) {
      return title.replace(eng, rus);
    }
  }
  
  // Если перевода нет, возвращаем оригинал (или можно написать "Товар")
  return title; 
};

// Функция перевода категорий
export const translateCategory = (cat) => {
  return translationDict[cat] || cat;
};

// Функция перевода описаний
export const translateDescription = (desc) => {
  if (!desc) return "Описание отсутствует. Отличный выбор для настоящего коллекционера!";
  
  // Если описание длинное, берем первые предложения и переводим
  let translated = desc;
  for (const [eng, rus] of Object.entries(descriptionDict)) {
    translated = translated.replace(new RegExp(eng, 'gi'), rus);
  }
  
  // Если текст остался на английском, добавляем красивую заглушку
  if (/[a-zA-Z]/.test(translated)) {
    return translated + " (Отличный товар для вашей коллекции. Подробные характеристики уточняйте у оператора.)";
  }
  
  return translated;
};