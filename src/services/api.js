const BASE_URL = 'https://dummyjson.com';

export async function fetchApi(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
  return res.json();
}