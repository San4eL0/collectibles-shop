import localProducts from '../data/products.json';

// Имитация задержки сети (чтобы было видно лоадеры)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CUSTOM_KEY = 'collector_custom_products';

// Кастомные товары (добавленные пользователем) храним в localStorage
function getCustom() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; } catch { return []; }
}
function saveCustom(items) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(items));
}

// Объединяем локальные и кастомные товары
function allProducts() {
  return [...localProducts, ...getCustom()];
}

export async function fetchApi(endpoint, options = {}) {
  await delay(300); // Имитируем загрузку в 300мс

  const method = (options?.method || 'GET').toUpperCase();

  // --- Собственные товары: CRUD ---
  if (endpoint === '/products' && (method === 'POST')) {
    const body = JSON.parse(options.body || '{}');
    const custom = getCustom();
    const maxLocalId = localProducts.reduce((m, p) => Math.max(m, p.id), 0);
    const maxCustomId = custom.reduce((m, p) => Math.max(m, p.id), 0);
    const newProduct = {
      id: Math.max(maxLocalId, maxCustomId) + 1,
      title: body.title || 'Без названия',
      category: body.category || 'figures',
      era: body.era || 'modern',
      price: Number(body.price) || 0,
      rating: body.rating != null ? Number(body.rating) : 4.5,
      thumbnail: body.thumbnail || 'https://placehold.co/600x600/7a6bc4/ffffff?text=NO+IMAGE',
      description: body.description || 'Описание товара отсутствует.',
      stock: Number(body.stock) || 1,
      custom: true,
      createdAt: Date.now(),
    };
    custom.unshift(newProduct);
    saveCustom(custom);
    return newProduct;
  }

  if (endpoint.match(/^\/products\/\d+$/) && method === 'PUT') {
    const id = parseInt(endpoint.split('/').pop(), 10);
    const body = JSON.parse(options.body || '{}');
    const custom = getCustom();
    const idx = custom.findIndex(p => p.id === id);
    if (idx === -1) return { error: 'not_custom' }; // нельзя редактировать базовые товары
    custom[idx] = { ...custom[idx], ...body, id, custom: true };
    saveCustom(custom);
    return custom[idx];
  }

  if (endpoint.match(/^\/products\/\d+$/) && method === 'DELETE') {
    const id = parseInt(endpoint.split('/').pop(), 10);
    const custom = getCustom();
    const next = custom.filter(p => p.id !== id);
    const wasCustom = custom.some(p => p.id === id);
    saveCustom(next);
    return { ok: wasCustom, custom: wasCustom };
  }

  // Обработка поиска
  if (endpoint.includes('/products/search')) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const q = (urlParams.get('q') || '').toLowerCase();
    const filtered = allProducts().filter(p => p.title.toLowerCase().includes(q));
    return { products: filtered, total: filtered.length };
  }

  // Обработка получения по категории
  if (endpoint.includes('/products/category/')) {
    const category = endpoint.split('/products/category/')[1].split('?')[0];
    const filtered = allProducts().filter(p => p.category === category);
    return { products: filtered, total: filtered.length };
  }

  // Обработка получения конкретного товара
  if (endpoint.match(/\/products\/\d+/)) {
    const id = parseInt(endpoint.split('/').pop(), 10);
    const product = allProducts().find(p => p.id === id);
    if (!product) throw new Error('Товар не найден');
    return product;
  }

  // Обработка получения всех товаров
  if (endpoint.includes('/products')) {
    let result = [...allProducts()];
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