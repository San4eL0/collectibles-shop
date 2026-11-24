import localProducts from '../data/products.json';

// Имитация задержки сети (чтобы было видно лоадеры)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CUSTOM_KEY = 'collector_custom_products';
const USERS_KEY = 'collector_accounts';
const ORDERS_KEY = 'collector_orders';
const REVIEWS_KEY = 'collector_reviews';
const SESSION_KEY = 'collector_session';

// --- Утилиты доступа к локальному хранилищу ---
function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Аккаунты ---
export function getAccounts() {
  const accounts = readLS(USERS_KEY, []);
  // Гарантируем наличие тестового админа emilys
  if (!accounts.some(u => u.username === 'emilys')) {
    accounts.unshift({
      id: 1,
      username: 'emilys',
      password: 'emilyspass',
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily@example.com',
      role: 'admin',
      createdAt: Date.now(),
    });
    writeLS(USERS_KEY, accounts);
  }
  return accounts;
}
function saveAccounts(list) { writeLS(USERS_KEY, list); }
export function getSession() { return readLS(SESSION_KEY, null); }
function setSession(session) {
  if (session) writeLS(SESSION_KEY, session); else localStorage.removeItem(SESSION_KEY);
}

// --- Заказы ---
function getOrders() { return readLS(ORDERS_KEY, []); }
function saveOrders(list) { writeLS(ORDERS_KEY, list); }

// --- Отзывы ---
function getReviews() { return readLS(REVIEWS_KEY, []); }
function saveReviews(list) { writeLS(REVIEWS_KEY, list); }

// --- Кастомные товары ---
function getCustom() { return readLS(CUSTOM_KEY, []); }
function saveCustom(items) { writeLS(CUSTOM_KEY, items); }

function allProducts() { return [...localProducts, ...getCustom()]; }

function publicUser(u) {
  return { id: u.id, username: u.username, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role };
}

function issueToken(user) {
  // Имитация JWT — в реальном проекте эндпоинт выдиёт подписанный токен
  return `mock-${user.id}-${Date.now()}`;
}

export async function fetchApi(endpoint, options = {}) {
  await delay(300);

  const method = (options?.method || 'GET').toUpperCase();
  const authHeader = options?.headers?.Authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  function currentUserByToken(tok) {
    if (!tok) return null;
    const accounts = getAccounts();
    return accounts.find(u => u.id === Number(tok.split('-')[1])) || null;
  }
  const authedUser = currentUserByToken(token);

  // --- Отзывы и оценки ---
  if (endpoint.includes('/reviews') && method === 'GET') {
    const idMatch = endpoint.match(/\/reviews\/product\/(\d+)/);
    if (idMatch) {
      return { reviews: getReviews().filter(r => r.productId === Number(idMatch[1])) };
    }
    return { reviews: getReviews() };
  }

  if (endpoint.includes('/reviews') && method === 'POST') {
    const idMatch = endpoint.match(/\/reviews\/product\/(\d+)/);
    if (!authedUser) throw new Error('Необходимо войти в аккаунт, чтобы оставить отзыв');
    const body = JSON.parse(options.body || '{}');
    const productId = idMatch ? Number(idMatch[1]) : Number(body.productId);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 0));
    if (!rating) throw new Error('Укажите оценку от 1 до 5');
    const text = String(body.text || '').trim();
    if (!text) throw new Error('Текст отзыва не может быть пустым');

    const reviews = getReviews();
    const existing = reviews.findIndex(r => r.productId === productId && r.authorId === authedUser.id);
    const review = {
      id: Date.now(),
      productId,
      authorId: authedUser.id,
      authorName: `${authedUser.firstName} ${authedUser.lastName}`,
      rating,
      text,
      createdAt: Date.now(),
    };
    if (existing !== -1) reviews[existing] = { ...reviews[existing], ...review }; // один отзыв на товар
    else reviews.unshift(review);
    saveReviews(reviews);
    return review;
  }

  // --- Собственные товары: CRUD ---
  if (endpoint === '/products' && method === 'POST') {
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
    if (idx === -1) return { error: 'not_custom' };
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
    if (endpoint.includes('sortBy=rating')) {
      result.sort((a, b) => b.rating - a.rating);
    }
    return { products: result, total: result.length };
  }

  // --- История заказов конкретного пользователя (видна только владельцу) ---
  if (endpoint.match(/^\/carts\/user\/\d+$/) && method === 'GET') {
    const idMatch = endpoint.match(/^\/carts\/user\/(\d+)$/);
    const ownerId = Number(idMatch[1]);
    if (!authedUser) throw new Error('Необходимо войти в аккаунт');
    if (authedUser.id !== ownerId && authedUser.role !== 'admin') throw new Error('Доступ запрещён');
    const orders = getOrders()
      .filter(o => o.userId === ownerId)
      .sort((a, b) => b.createdAt - a.createdAt);
    return { carts: orders };
  }

  // --- Все заказы (для админа) ---
  if (endpoint.includes('/carts') && method === 'GET') {
    if (!authedUser || authedUser.role !== 'admin') throw new Error('Доступ запрещён');
    const orders = [...getOrders()].sort((a, b) => b.createdAt - a.createdAt);
    return { carts: orders };
  }

  // --- Создание заказа из корзины ---
  if (endpoint === '/carts' && method === 'POST') {
    if (!authedUser) throw new Error('Необходимо войти в аккаунт');
    const body = JSON.parse(options.body || '{}');
    const items = Array.isArray(body.products) ? body.products : [];
    const total = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
    const order = {
      id: getOrders().length ? Math.max(...getOrders().map(o => o.id)) + 1 : 1001,
      userId: authedUser.id,
      products: items,
      total,
      status: 'processing',
      address: body.address || '',
      createdAt: Date.now(),
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    return { cart: order, id: order.id };
  }

  // --- Регистрация аккаунта ---
  if (endpoint === '/users/add' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const username = String(body.username || '').trim().toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();

    if (!username || !body.password || !body.firstName || !body.lastName) {
      throw new Error('Заполните все поля');
    }
    const accounts = getAccounts();
    if (accounts.some(u => u.username.toLowerCase() === username)) {
      throw new Error('Такой логин уже занят');
    }
    if (accounts.some(u => u.email.toLowerCase() === email)) {
      throw new Error('Такой email уже зарегистрирован');
    }

    const newUser = {
      id: accounts.length ? Math.max(...accounts.map(u => u.id)) + 1 : 1,
      username,
      password: body.password,
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email,
      role: 'user',
      createdAt: Date.now(),
    };
    accounts.push(newUser);
    saveAccounts(accounts);

    const token = issueToken(newUser);
    setSession({ userId: newUser.id, token });
    return { ...publicUser(newUser), accessToken: token };
  }

  // --- Вход ---
  if (endpoint.includes('/auth/login')) {
    const body = JSON.parse(options.body || '{}');
    const login = String(body.username || '').trim().toLowerCase();
    const pass = String(body.password || '');
    const account = getAccounts().find(u => u.username.toLowerCase() === login);
    if (!account || account.password !== pass) {
      throw new Error('Неверный логин или пароль');
    }
    const token = issueToken(account);
    setSession({ userId: account.id, token });
    return { ...publicUser(account), accessToken: token };
  }

  // --- Данные текущего пользователя по токену ---
  if (endpoint.includes('/auth/me')) {
    if (!authedUser) throw new Error('Не авторизован');
    return publicUser(authedUser);
  }

  return {};
}

// Интеграция: сохранённая сессия пользователя (для инициализации на старте)
export function restoreSessionUser() {
  const session = getSession();
  if (!session) return null;
  const account = getAccounts().find(u => u.id === session.userId);
  if (!account) return null;
  return { ...publicUser(account), accessToken: session.token };
}

export { getOrders, getReviews };