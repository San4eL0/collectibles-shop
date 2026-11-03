import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { assetUrl } from '../utils/assetUrl.js';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { IconArrowRight, IconCart, IconShield, IconCheck } from '../components/icons.jsx';
import Loader from '../components/Loader.jsx';

const PLATFORMS = { cp2077: 'PG', witcher: 'PG', elden: 'PC', tlou: 'SONY', gow: 'PG', ghost: 'SONY' };
const GAME_TAG = { cp2077: 'НЕЙРО-ИЗДАНИЕ', witcher: 'STL-BOX', elden: 'ГОЛД-ЭДШН', tlou: 'SPECIAL ED', gow: 'ОДИНЦИМИР', ghost: 'DIRECTOR\'S' };

const GAMES_ARR = null;

function GameCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();
  const handleAdd = () => { addItem(product); showToast(`«${product.title}» добавлен в корзину`); };

  const shortTitle = product.title.split('—')[0].split(' - ')[0].trim();
  const edition = product.title.split('—')[1]?.trim() || 'Limited Edition';
  const slug = product.title.slice(-8).toLowerCase();

  return (
    <div className="game-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Верхняя неоновая линия */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--cyan), var(--magenta))', boxShadow: '0 0 12px var(--cyan)', zIndex: 3 }} />

      <Link to={`/product/${product.id}`} className="card-img-link game-cover" style={{ display: 'block', position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', textDecoration: 'none' }}>
        <img
          src={assetUrl(product.thumbnail)}
          alt={product.title}
          className="card-img"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Затемнение для читаемости */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(4,3,10,0.85))' }} />
        {/* Платформа */}
        <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, padding: '2px 8px', background: 'rgba(4,3,10,0.8)', border: '1px solid var(--cyan)', color: 'var(--cyan)', fontFamily: 'var(--font-display)', fontSize: '0.68rem', letterSpacing: 1 }}>
          {PLATFORMS[slug] || 'LTD'}
        </span>
        {/* Метка лимитированного тиража */}
        <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, padding: '2px 8px', background: 'var(--magenta)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: 1, boxShadow: '0 0 10px var(--magenta)' }}>
          LTD //
        </span>
        {/* Название поверх обложки */}
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.62rem', letterSpacing: 2, color: 'var(--accent)' }}>{GAME_TAG[slug] || 'LIMITED'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.25, color: '#fff', textShadow: '0 0 12px rgba(0,0,0,0.8)' }}>
            {shortTitle}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{edition}</div>
        </div>
      </Link>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, background: 'linear-gradient(180deg, var(--bg-2), var(--surface))' }}>
        {/* Рейтинг + остаток */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>★ {product.rating?.toFixed(1) || '—'}</span>
          <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontSize: '0.72rem', fontFamily: 'var(--font-display)' }}>
            {product.stock > 0 ? `В НАЛИЧИИ: ${product.stock}` : 'НЕТ'}
          </span>
        </div>

        {/* Кнопка добавления */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <strong style={{ color: 'var(--cyan)', fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>
            {product.price.toLocaleString('ru-RU')} ₽
          </strong>
          <button className="btn btn-primary" onClick={handleAdd} style={{ padding: '5px 12px', fontSize: '0.72rem', minHeight: '34px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <IconCart width={14} height={14} /> В КОРЗИНУ
          </button>
        </div>

        <Link to={`/product/${product.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.78rem', justifySelf: 'start', textDecoration: 'none' }}>
          Подробнее <IconArrowRight width={12} height={12} />
        </Link>
      </div>
    </div>
  );
}

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi('/products/category/games')
      .then((data) => setGames(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero-баннер игр */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: '2px solid var(--border-glow)',
        background: 'linear-gradient(120deg, #0a0914 0%, #1a1040 50%, #0a1a3a 100%)',
        padding: '56px 16px', textAlign: 'center',
      }}>
        {/* Диагональные неоновые полосы */}
        <div style={{ position: 'absolute', inset: '-10%', background: `linear-gradient(115deg, transparent 20%, rgba(0,240,255,0.12) 26%, transparent 32%, transparent 55%, rgba(255,58,139,0.10) 61%, transparent 67%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: 6, fontSize: '0.8rem', color: 'var(--accent)', marginBottom: 8 }}>/// GAME.VAULT // ИГРОТЕКА</div>
          <h1 className="glitch" data-text="Лимитированные издания игр" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', color: '#fff', textShadow: '0 0 30px var(--cyan), 0 0 60px var(--magenta)' }}>
            Лимитированные издания игр
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '14px auto 0' }}>
            Только официальные ограниченные тиражи — коллекционные издания, стилбуки и эксклюзивные наборы с фирменными обложками. Выпущено малым тиражом, доступно немногим.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '22px', flexWrap: 'wrap' }}>
            <Link to="/catalog/games" className="btn btn-primary"><IconShield width={16} height={16} /> Все издания</Link>
            <Link to="/catalog" className="btn btn-outline">Весь каталог</Link>
          </div>
        </div>
        {/* Нижняя градиентная линия */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--cyan), var(--magenta), transparent)', boxShadow: '0 0 14px var(--cyan)' }} />
      </div>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="section-title" style={{ fontSize: '1.4rem', margin: 0 }}>ИГРОВАЯ ПОЛКА // SHELF</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>{games.length} ИЗДАНИЙ // EDITIONS</span>
        </div>

        {loading && <Loader />}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '18px' }}>
            {games.map((g) => <GameCard key={g.id} product={g} />)}
          </div>
        )}

        <div style={{ marginTop: '36px', padding: '16px 18px', border: '1px solid var(--border-glow)', background: 'var(--bg-2)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent)', marginTop: 2 }}><IconCheck width={18} height={18} /></span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Каждое издание <strong>проверено и сертифицировано</strong>. Тиражи ограничены — издание может быть снято с продажи без предупреждения. Официальные обложки и упаковка гарантированы.
          </p>
        </div>
      </div>

      <style>{`
        .game-card:hover .card-img { transform: scale(1.06); }
        @media (max-width: 640px) {
          .game-card { max-width: 100%; }
          .game-card .game-cover { aspect-ratio: 16 / 10; }
        }
      `}</style>
    </div>
  );
}