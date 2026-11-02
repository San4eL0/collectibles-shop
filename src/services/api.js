import localProducts from '../data/products.json';

// Имитация задержки сети (чтобы было видно лоадеры)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchApi(endpoint, options = {}) {
  await delay(300); // Имитируем загрузку в 300мс

  // Обработка поиска
  if (endpoint.includes('/products/search')) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const q = (urlParams.get('q') || '').toLowerCase();
    const filtered = localProducts.filter(p => p.title.toLowerCase().includes(q));
    return { products: filtered, total: filtered.length };
  }

  // Обработка получения по категории
  if (endpoint.includes('/products/category/')) {
    const category = endpoint.split('/products/category/')[1].split('?')[0];
    const filtered = localProducts.filter(p => p.category === category);
    return { products: filtered, total: filtered.length };
  }

  // Обработка получения конкретного товара
  if (endpoint.match(/\/products\/\d+/)) {
    const id = parseInt(endpoint.split('/').pop(), 10);
    const product = localProducts.find(p => p.id === id);
    if (!product) throw new Error('Товар не найден');
    return product;
  }

  // Обработка получения всех товаров
  if (endpoint.includes('/products')) {
    let result = [...localProducts];
    // Простая сортировка для главной страницы
    if (endpoint.includes('sortBy=rating')) {
      result.sort((a, b) => b.rating - a.rating);
    }
    return { products: result, total: result.length };
  }

  // Заглушки для логина и корзины (чтобы не ломался остальной сайт)
  if (endpoint.includes('/auth/login')) {
    return { id: 1, username: 'emilys', firstName: 'Emily', lastName: 'Johnson', email: 'emily@example.com', accessToken: 'fake-token', role: 'admin' };
  }
  if (endpoint.includes('/auth/me')) {
    return { id: 1, username: 'emilys', firstName: 'Emily', lastName: 'Johnson', email: 'emily@example.com', role: 'admin' };
  }

  return {};
}
