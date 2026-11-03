import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assetUrl.js';

const SLIDES = [
  {
    image: '/images/1.jpg',
    tag: 'VINTAGE ARCHEIV',
    title: 'Редкие сокровища для настоящих коллекционеров',
    text: 'Виниловые пластинки, эксклюзивные фигурки, нумизматика — артефакты одной эры с проверенной историей.',
    to: '/catalog/vinyl',
    cta: 'Открыть архив',
    accent: '#00f0ff',
  },
  {
    image: '/images/2.jpg',
    tag: 'NETRUNNER GEAR',
    title: 'Коллекционные фигурки из миров будущего',
    text: 'Детализированные статуэтки масштаба 1/6 и 1/4. Каждая — редкий экземпляр, не для прохожих.',
    to: '/catalog/figures',
    cta: 'Сканировать базу',
    accent: '#ff3a8b',
  },
  {
    image: '/images/3.jpg',
    tag: 'EDDIESS // CRED',
    title: 'Монеты и нумизматика прошлых эпох',
    text: 'Серебро, золото, история. Раритетные экземпляры в отличной сохранности для серьёзных раскладок.',
    to: '/catalog/coins',
    cta: 'Проверить реестр',
    accent: '#ffd500',
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => {
    setTransitioning(true);
    setTimeout(() => {
      setIndex(i);
      setTransitioning(false);
    }, 200);
  }, []);

  const next = useCallback(() => goTo((index + 1) % SLIDES.length), [goTo, index]);
  const prev = useCallback(() => goTo((index - 1 + SLIDES.length) % SLIDES.length), [goTo, index]);

  useEffect(() => {
    timerRef.current = setInterval(next, 7000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <div
      className="hero-slider cp-card"
      style={{ margin: '0 0 40px', overflow: 'hidden', minHeight: '420px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      {/* Левая часть — изображение */}
      <div style={{ position: 'relative', minHeight: '360px', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
        <img
          src={assetUrl(slide.image)}
          alt={slide.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0,
            filter: 'grayscale(0.4) contrast(1.15) saturate(1.1)',
            opacity: transitioning ? 0.2 : 1,
            transition: 'opacity 0.2s, transform 6s ease',
            transform: 'scale(1.08)',
          }}
        />
        {/* Cyan overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(0,240,255,0.25))`, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 60%, rgba(10,9,20,0.6))' }} />
        <div className="corner-tag" />

        {/* Терминальные декор-линии */}
        <div style={{ position: 'absolute', left: 16, bottom: 16, color: 'var(--cyan)', fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: 2 }}>
          CAP. 0{index + 1} / 0{SLIDES.length} // CLR-{String.fromCharCode(65 + index)}
        </div>
        <div style={{ position: 'absolute', right: 16, top: 16, display: 'flex', gap: 4, alignItems: 'center', fontFamily: 'var(--font-display)', fontSize: '0.7rem' }}>
          <span style={{ width: 8, height: 8, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)', animation: 'blink 1s infinite' }} />
          <span style={{ color: 'var(--accent)' }}>LIVE</span>
        </div>
      </div>

      {/* Правая часть — контент */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px', padding: '40px 36px', position: 'relative' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 3, color: slide.accent }}>
          ▸ {slide.tag}
        </span>

        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', lineHeight: 1.2, textShadow: `0 0 24px ${slide.accent}55` }}>
          {slide.title}
        </h1>

        <p style={{ maxWidth: '480px', opacity: 0.85, color: 'var(--text-muted)' }}>{slide.text}</p>

        <Link to={slide.to} className="btn btn-primary" style={{ justifySelf: 'start' }}>
          {slide.cta} →
        </Link>

        {/* Контролы слайдера */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === index ? 32 : 16, height: 4,
                  background: i === index ? slide.accent : 'var(--border)',
                  boxShadow: i === index ? `0 0 8px ${slide.accent}` : 'none',
                  transition: '0.2s',
                }}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button onClick={prev} className="btn btn-outline" style={{ padding: '4px 12px', minHeight: '34px' }}>◄</button>
            <button onClick={next} className="btn btn-outline" style={{ padding: '4px 12px', minHeight: '34px' }}>►</button>
          </div>
        </div>
      </div>

      {/* Верхний линейный декор */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${slide.accent}, transparent 70%)`, boxShadow: `0 0 12px ${slide.accent}` }} />

      <style>{`
        @media (max-width: 760px) {
          .hero-slider { grid-template-columns: 1fr !important; }
          .hero-slider > div:first-child { min-height: 220px !important; }
        }
        @keyframes blink { 50% { opacity: 0.2; } }
      `}</style>
    </div>
  );
}