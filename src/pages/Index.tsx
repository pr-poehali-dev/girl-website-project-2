import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMG = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/be10d329-f2c9-4c6f-b4aa-f14c54502053.jpg';
const IMG2 = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/cd847a8a-5d19-4505-b9e6-059639efe8c6.jpg';
const IMG3 = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/13866e00-0dfc-4597-8e2d-98b5f8c91760.jpg';

const TIMELINE = [
  { date: '23 января', title: 'Первая встреча', desc: 'Мы познакомились глупо, на глупом сайте знакомств. Тогда я ещё подумать не мог, что та девочка, рассказывающая мне про то, что ей снятся кошмары — будет той самой.', emoji: '🌹' },
  { date: '1 мая 2022', title: 'Первое путешествие', desc: 'Мы открыли для себя новые места и поняли: вдвоём любой маршрут — приключение.', emoji: '✈️' },
  { date: '14 февраля 2023', title: 'Год вместе', desc: 'Первая годовщина. Столько воспоминаний, столько смеха и тепла.', emoji: '💌' },
  { date: '2024', title: 'Наши планы', desc: 'Впереди — ещё больше путешествий, открытий и счастливых моментов вместе.', emoji: '🌸' },
];

const GALLERY = [
  { img: IMG2, label: 'Романтический вечер' },
  { img: IMG3, label: 'Городские прогулки' },
  { img: HERO_IMG, label: 'Наш портрет' },
  { img: IMG2, label: 'Вместе' },
];

// Точки на карте — замените на свои координаты
const MAP_POINTS = [
  { x: 52, y: 38, label: 'Первая встреча', emoji: '🌹', desc: 'Москва' },
  { x: 34, y: 44, label: 'Первое путешествие', emoji: '✈️', desc: 'Санкт-Петербург' },
  { x: 68, y: 30, label: 'Любимое кафе', emoji: '☕', desc: 'Место силы' },
  { x: 45, y: 58, label: 'Годовщина', emoji: '💌', desc: 'Наш ресторан' },
];

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${5 + i * 6.5}%`,
  size: 14 + Math.random() * 10,
  duration: 8 + Math.random() * 7,
  delay: Math.random() * 10,
}));

function Petals() {
  return (
    <>
      {PETALS.map(p => (
        <div key={p.id} className="petal" style={{ left: p.left, fontSize: `${p.size}px`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}>
          🌸
        </div>
      ))}
    </>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative z-10 py-28 px-6">
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return <p style={{ color, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>— {children}</p>;
}

// ─── Интерактивная карта ───
function LoveMap() {
  const [activePin, setActivePin] = useState<number | null>(null);

  return (
    <div className="reveal glass-rose rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,179,198,0.4)', marginTop: '32px' }}>
      <div style={{ padding: '20px 24px 8px', borderBottom: '1px solid rgba(255,179,198,0.25)' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)' }}>
          ✦ наши места
        </p>
        <p style={{ fontFamily: "'Cormorant', serif", fontSize: '22px', fontWeight: 400, color: 'var(--rose-text)' }}>
          Карта нашей истории
        </p>
      </div>

      {/* Map container */}
      <div className="relative" style={{ height: '320px', background: 'linear-gradient(135deg, #fce8f0 0%, #fdf0f5 40%, #f0e8f8 100%)', overflow: 'hidden' }}>

        {/* Decorative grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--rose-main)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative curved lines (roads/rivers) */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <path d="M 0 180 Q 200 120 400 200 T 800 160" fill="none" stroke="var(--rose-deep)" strokeWidth="2" strokeDasharray="8 4" />
          <path d="M 100 0 Q 180 150 120 320" fill="none" stroke="var(--rose-mid)" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M 300 0 Q 350 100 280 320" fill="none" stroke="var(--rose-mid)" strokeWidth="1.5" strokeDasharray="6 6" />
          <ellipse cx="52%" cy="45%" rx="80" ry="50" fill="rgba(255,179,198,0.18)" />
          <ellipse cx="30%" cy="60%" rx="60" ry="35" fill="rgba(255,214,224,0.22)" />
        </svg>

        {/* Map pins */}
        {MAP_POINTS.map((point, i) => (
          <div
            key={i}
            style={{ position: 'absolute', left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%, -100%)', zIndex: activePin === i ? 20 : 10, cursor: 'pointer' }}
            onClick={() => setActivePin(activePin === i ? null : i)}
          >
            {/* Pin */}
            <div
              className={activePin === i ? 'animate-float' : ''}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                filter: `drop-shadow(0 4px 12px rgba(232,103,122,${activePin === i ? 0.5 : 0.3}))`,
                transition: 'filter 0.3s',
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
                background: activePin === i
                  ? 'linear-gradient(135deg, var(--rose-deep), var(--rose-main))'
                  : 'linear-gradient(135deg, var(--rose-main), #f093a0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: activePin === i ? '0 4px 20px rgba(232,103,122,0.5)' : '0 2px 10px rgba(232,103,122,0.3)',
                transition: 'all 0.3s',
                border: '2px solid white',
              }}>
                <span style={{ transform: 'rotate(45deg)', fontSize: '16px', lineHeight: 1 }}>{point.emoji}</span>
              </div>
              <div style={{ width: '2px', height: '10px', background: 'var(--rose-deep)', opacity: 0.6 }} />
            </div>

            {/* Tooltip */}
            {activePin === i && (
              <div
                className="animate-fadeIn"
                style={{
                  position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
                  background: 'white', borderRadius: '12px', padding: '10px 14px',
                  boxShadow: '0 8px 32px rgba(232,103,122,0.2)',
                  border: '1px solid rgba(255,179,198,0.5)',
                  whiteSpace: 'nowrap', minWidth: '130px', textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: '16px', fontWeight: 500, color: 'var(--rose-text)', marginBottom: '2px' }}>
                  {point.label}
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: 'var(--rose-main)', opacity: 0.8 }}>
                  {point.desc}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Connecting dashed line between pins */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <polyline
            points={MAP_POINTS.map(p => `${p.x}%,${p.y}%`).join(' ')}
            fill="none"
            stroke="var(--rose-mid)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.5"
          />
        </svg>

        {/* Hint */}
        <div style={{ position: 'absolute', bottom: '12px', right: '16px' }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: 'var(--rose-main)', opacity: 0.6, letterSpacing: '0.1em' }}>
            нажми на точку ✦
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Строки письма — появляются одна за другой ───
const LETTER_LINES = [
  { text: 'Дорогая,', type: 'greeting' },
  { text: 'я знаю, что наша история не такая долгая,', type: 'body' },
  { text: 'но я хочу сделать всё, чтобы она длилась вечность.', type: 'body' },
  { text: 'Хочу просто вспомнить с тобой,', type: 'body' },
  { text: 'как всё началось…', type: 'end' },
];

function MainView({ onGoPath }: { onGoPath: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    setVisibleLines([]);
    LETTER_LINES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, 400 + i * 700);
    });
  }, []);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Декоративный верх */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            className="animate-float"
            style={{ fontSize: '42px', display: 'inline-block', marginBottom: '20px' }}
          >
            🌹
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--rose-mid), transparent)', marginBottom: '20px' }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--rose-main)',
            opacity: 0.6,
          }}>
            ✦ главная
          </p>
        </div>

        {/* Карточка письма */}
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '48px 40px 56px',
          boxShadow: '0 16px 64px rgba(232,103,122,0.13)',
          border: '1px solid rgba(255,179,198,0.35)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '320px',
        }}>
          {/* Цветная полоска сверху */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
            background: 'linear-gradient(90deg, var(--rose-soft), var(--rose-main), var(--rose-soft))',
          }} />

          {/* Декоративные линии в стиле нотной бумаги */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              position: 'absolute',
              left: '40px', right: '40px',
              top: `${100 + i * 54}px`,
              height: '1px',
              background: 'rgba(255,179,198,0.18)',
              pointerEvents: 'none',
            }} />
          ))}

          {/* Текст письма */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {LETTER_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  opacity: visibleLines.includes(i) ? 1 : 0,
                  transform: visibleLines.includes(i) ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.8s cubic-bezier(.22,.68,0,1.2), transform 0.8s cubic-bezier(.22,.68,0,1.2)',
                }}
              >
                {line.type === 'greeting' ? (
                  <p style={{
                    fontFamily: "'Cormorant', serif",
                    fontSize: 'clamp(28px, 6vw, 40px)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'var(--rose-deep)',
                    lineHeight: 1.2,
                    marginBottom: '8px',
                  }}>
                    {line.text}
                  </p>
                ) : line.type === 'end' ? (
                  <p style={{
                    fontFamily: "'Cormorant', serif",
                    fontSize: 'clamp(20px, 4vw, 28px)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--rose-main)',
                    lineHeight: 1.5,
                    marginTop: '8px',
                  }}>
                    {line.text}
                  </p>
                ) : (
                  <p style={{
                    fontFamily: "'Cormorant', serif",
                    fontSize: 'clamp(18px, 3.5vw, 24px)',
                    fontWeight: 300,
                    color: 'var(--rose-text)',
                    lineHeight: 1.6,
                    opacity: 0.85,
                  }}>
                    {line.text}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Подпись — появляется последней */}
          <div style={{
            marginTop: '40px',
            borderTop: '1px dashed rgba(255,179,198,0.4)',
            paddingTop: '20px',
            textAlign: 'right',
            opacity: visibleLines.includes(LETTER_LINES.length - 1) ? 1 : 0,
            transition: 'opacity 1.2s ease 0.4s',
          }}>
            <p style={{ fontFamily: "'Cormorant', serif", fontSize: '20px', fontStyle: 'italic', color: 'var(--rose-main)' }}>
              Твой 🌸
            </p>
          </div>

          {/* Кнопка перехода — появляется после подписи */}
          <div style={{
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'center',
            opacity: visibleLines.includes(LETTER_LINES.length - 1) ? 1 : 0,
            transform: visibleLines.includes(LETTER_LINES.length - 1) ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s ease 1.2s, transform 1s ease 1.2s',
          }}>
            <button
              onClick={onGoPath}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, var(--rose-main), var(--rose-deep))',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                padding: '14px 32px',
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 28px rgba(232,103,122,0.35)',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(232,103,122,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(232,103,122,0.35)';
              }}
            >
              Наш путь
              <span style={{ fontSize: '16px' }}>→</span>
            </button>
          </div>
        </div>

        {/* Мягкое свечение снизу */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            opacity: visibleLines.includes(LETTER_LINES.length - 1) ? 0.55 : 0,
            transition: 'opacity 1.5s ease 1s',
          }}>
            <div style={{ width: '30px', height: '1px', background: 'var(--rose-mid)' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)' }}>
              наша история
            </p>
            <div style={{ width: '30px', height: '1px', background: 'var(--rose-mid)' }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Index() {
  const [view, setView] = useState<'home' | 'main' | 'path' | 'letter'>('home');
  const [btnXFlipped, setBtnXFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Фото плавно исчезает при скролле
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.6));
      setHeroOpacity(fade);

      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    }, 100);
    window.scrollTo({ top: 0 });
  }, [view]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--cream)' }}>
      <Petals />

      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,214,224,0.5) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-15%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(255,179,198,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3" type="audio/mpeg" />
      </audio>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-white' : ''}`}
        style={{ padding: scrolled ? '12px 24px' : '20px 24px' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            style={{ fontFamily: "'Cormorant', serif", fontWeight: 600, fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' }}
            className="rose-gradient-text"
          >
            М&nbsp;&amp;&nbsp;А
          </button>
          {view !== 'home' && (
            <button
              onClick={() => setView('home')}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--rose-text)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
            >
              ← Назад
            </button>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════
           HOME VIEW
      ══════════════════════════════ */}
      {view === 'home' && (
        <div>
          {/* HERO — фото исчезает при скролле */}
          <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
              opacity: heroOpacity,
              transition: 'opacity 0.05s linear',
              zIndex: 0,
              willChange: 'opacity',
            }}>
              <img
                src={HERO_IMG}
                alt="Главное фото"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85) brightness(0.92)' }}
              />
              {/* Fade to cream at bottom */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(255,250,249,0) 0%, rgba(255,250,249,0) 35%, rgba(255,250,249,0.55) 65%, rgba(255,250,249,1) 100%)',
              }} />
            </div>

            {/* Title over photo */}
            <div style={{ position: 'absolute', bottom: '48px', left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
              <h1
                className="animate-fadeInUp"
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: 'clamp(60px, 14vw, 130px)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: 'white',
                  textShadow: '0 2px 40px rgba(80,10,20,0.3)',
                  marginBottom: '8px',
                  opacity: 0,
                }}
              >
                М&nbsp;&amp;&nbsp;А
              </h1>
              <p
                className="animate-fadeInUp delay-300"
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: 'clamp(15px, 3vw, 22px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.82)',
                  letterSpacing: '0.2em',
                  textShadow: '0 1px 16px rgba(80,10,20,0.3)',
                  opacity: 0,
                }}
              >
                наша история
              </p>

              {/* Scroll hint */}
              <div className="animate-float" style={{ marginTop: '32px', opacity: 0.7 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                  листай вниз
                </p>
                <Icon name="ChevronDown" size={20} style={{ color: 'rgba(255,255,255,0.5)', margin: '0 auto' }} />
              </div>
            </div>
          </div>

          {/* BUTTONS SECTION */}
          <div style={{ position: 'relative', zIndex: 10, background: 'var(--cream)', paddingTop: '32px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'stretch' }}>

              {/* ── Кнопка 1: ГЛАВНАЯ ── */}
              <button
                onClick={() => setView('main')}
                className="animate-fadeInUp delay-200 glass-rose"
                style={{
                  opacity: 0, textAlign: 'left', borderRadius: '20px', padding: '20px 24px',
                  border: '1px solid rgba(255,179,198,0.5)',
                  boxShadow: '0 4px 20px rgba(232,103,122,0.08)',
                  cursor: 'pointer', width: '100%',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(232,103,122,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,103,122,0.08)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '4px' }}>✦ раздел</p>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '28px', fontWeight: 400, color: 'var(--rose-text)' }}>Главная</p>
                  </div>
                  <Icon name="BookOpen" size={22} style={{ color: 'var(--rose-mid)', flexShrink: 0 }} />
                </div>
              </button>

              {/* ── Кнопка 2: НАШ ПУТЬ ── */}
              <button
                onClick={() => setView('path')}
                className="animate-fadeInUp delay-400 glass-rose"
                style={{
                  opacity: 0, textAlign: 'left', borderRadius: '20px', padding: '20px 24px',
                  border: '1px solid rgba(255,179,198,0.5)',
                  boxShadow: '0 4px 20px rgba(232,103,122,0.08)',
                  cursor: 'pointer', width: '100%',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(232,103,122,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,103,122,0.08)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '4px' }}>✦ раздел</p>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '28px', fontWeight: 400, color: 'var(--rose-text)' }}>Наш путь</p>
                  </div>
                  <Icon name="Map" size={22} style={{ color: 'var(--rose-mid)', flexShrink: 0 }} />
                </div>
              </button>

              {/* ── Кнопка 3: ПИСЬМО ── */}
              <button
                onClick={() => setView('letter')}
                className="animate-fadeInUp delay-500 glass-rose"
                style={{
                  opacity: 0, textAlign: 'left', borderRadius: '20px', padding: '20px 24px',
                  border: '1px solid rgba(255,179,198,0.5)',
                  boxShadow: '0 4px 20px rgba(232,103,122,0.08)',
                  cursor: 'pointer', width: '100%',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(232,103,122,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,103,122,0.08)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '4px' }}>✦ раздел</p>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '28px', fontWeight: 400, color: 'var(--rose-text)' }}>Письмо</p>
                  </div>
                  <Icon name="Mail" size={22} style={{ color: 'var(--rose-mid)', flexShrink: 0 }} />
                </div>
              </button>

              {/* ── КНОПКА Х (большая, главная) ── */}
              <div className="animate-fadeInUp delay-700" style={{ opacity: 0 }}>
                {/* Подсказка сверху */}
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: 'var(--rose-main)',
                  opacity: 0.65,
                  textAlign: 'center',
                  marginBottom: '10px',
                }}>
                  ↓ нажми, когда дочитаешь всё ↓
                </p>

                <button
                  onClick={() => setBtnXFlipped(f => !f)}
                  className="animate-breathe"
                  style={{
                    width: '100%',
                    borderRadius: '28px',
                    padding: '36px 28px',
                    background: 'linear-gradient(135deg, #e8677a 0%, #c94b5e 60%, #a83250 100%)',
                    boxShadow: '0 12px 48px rgba(200,75,90,0.4)',
                    border: '2px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.025)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  {/* Shimmer */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2.8s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />

                  {/* Inner ring decoration */}
                  <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '120px', height: '120px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.15)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '-40px', left: '-20px',
                    width: '140px', height: '140px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    pointerEvents: 'none',
                  }} />

                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div className="animate-heartbeat" style={{ fontSize: '36px', marginBottom: '10px', display: 'inline-block' }}>💝</div>
                      <div key={String(btnXFlipped)} className="btn-x-text">
                        {!btnXFlipped ? (
                          <>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
                              ✦ только для тебя
                            </p>
                            <p style={{ fontFamily: "'Cormorant', serif", fontSize: '38px', fontWeight: 400, color: 'white', lineHeight: 1.05 }}>
                              Кнопка Х
                            </p>
                          </>
                        ) : (
                          <>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '8px' }}>
                              ✦ скоро здесь будет
                            </p>
                            <p style={{ fontFamily: "'Cormorant', serif", fontSize: '24px', fontWeight: 300, color: 'white', lineHeight: 1.4, fontStyle: 'italic' }}>
                              Что-то очень важное для нас двоих…
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <Icon name="Sparkles" size={32} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                  </div>
                </button>
              </div>

            </div>

            {/* MAP */}
            <div style={{ maxWidth: '600px', margin: '32px auto 0' }}>
              <LoveMap />
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════
           MAIN VIEW
      ══════════════════════════════ */}
      {view === 'main' && <MainView onGoPath={() => setView('path')} />}

      {/* ══════════════════════════════
           PATH VIEW
      ══════════════════════════════ */}
      {view === 'path' && (
        <div style={{ paddingTop: '80px' }}>
          <Section id="path-content">
            <div className="reveal text-center" style={{ marginBottom: '48px' }}>
              <SectionLabel color="var(--rose-main)">Наш путь</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 300, color: 'var(--rose-text)', lineHeight: 1.1 }}>
                Шаг за <em style={{ fontStyle: 'italic', color: 'var(--rose-main)' }}>шагом</em>
              </h2>
            </div>

            <div className="reveal" style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {TIMELINE.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot">{item.emoji}</div>
                  <div className="glass-rose rounded-2xl" style={{ padding: '24px', marginLeft: '16px', border: '1px solid rgba(255,179,198,0.4)', boxShadow: '0 4px 20px rgba(232,103,122,0.07)' }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '6px' }}>{item.date}</p>
                    <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: '26px', fontWeight: 400, color: 'var(--rose-text)', marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: 'var(--rose-text)', opacity: 0.65, lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal text-center" style={{ marginTop: '64px' }}>
              <div className="glass-rose" style={{ borderRadius: '28px', padding: '40px', display: 'inline-block', border: '1px solid rgba(255,179,198,0.4)' }}>
                <div className="animate-float" style={{ fontSize: '40px', marginBottom: '16px' }}>🌹</div>
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--rose-text)', lineHeight: 1.6 }}>
                  «Каждый момент с тобой — мой любимый»
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ══════════════════════════════
           LETTER VIEW
      ══════════════════════════════ */}
      {view === 'letter' && (
        <div style={{ paddingTop: '80px' }}>
          <Section id="letter-content">
            <div className="reveal text-center" style={{ marginBottom: '40px' }}>
              <SectionLabel color="var(--rose-main)">Письмо</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 300, color: 'var(--rose-text)', lineHeight: 1.1 }}>
                Только <em style={{ fontStyle: 'italic', color: 'var(--rose-main)' }}>для тебя</em>
              </h2>
            </div>

            <div className="reveal" style={{ maxWidth: '560px', margin: '0 auto' }}>
              {/* Envelope card */}
              <div style={{
                background: 'white',
                borderRadius: '28px',
                padding: '48px 40px',
                boxShadow: '0 12px 60px rgba(232,103,122,0.12)',
                border: '1px solid rgba(255,179,198,0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative corner */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--rose-soft), var(--rose-main), var(--rose-soft))' }} />

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div className="animate-float" style={{ fontSize: '48px' }}>💌</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  {[90, 70, 85, 60, 80, 50].map((w, i) => (
                    <div key={i} style={{ height: '10px', width: `${w}%`, borderRadius: '9999px', background: `linear-gradient(90deg, var(--rose-soft), var(--rose-mid))`, opacity: 0.35 + i * 0.06 }} />
                  ))}
                </div>

                <p style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: '22px',
                  fontStyle: 'italic',
                  color: 'var(--rose-text)',
                  opacity: 0.6,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  Здесь будет твоё письмо…
                </p>

                {/* Signature area */}
                <div style={{ textAlign: 'right', marginTop: '40px', borderTop: '1px dashed rgba(255,179,198,0.4)', paddingTop: '20px' }}>
                  <p style={{ fontFamily: "'Cormorant', serif", fontSize: '20px', fontStyle: 'italic', color: 'var(--rose-main)' }}>
                    С любовью 🌸
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ height: '1px', maxWidth: '200px', margin: '0 auto 20px', background: 'linear-gradient(90deg, transparent, var(--rose-mid), transparent)' }} />
        <p style={{ fontFamily: "'Cormorant', serif", fontSize: '16px', color: 'var(--rose-main)', opacity: 0.55 }}>
          Сделано с любовью 🌸
        </p>
      </footer>

      {/* Music btn */}
      <button onClick={toggleMusic} className={`music-btn ${isPlaying ? 'playing' : ''}`} title={isPlaying ? 'Выключить' : 'Включить музыку'}>
        <Icon name={isPlaying ? 'Music' : 'Music2'} size={20} className="text-white" />
      </button>

      {isPlaying && (
        <div className="animate-fadeIn glass-white" style={{
          position: 'fixed', bottom: '90px', right: '16px', zIndex: 999,
          borderRadius: '999px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', color: 'var(--rose-main)',
          border: '1px solid rgba(255,179,198,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
            {[8, 14, 6, 12].map((h, b) => (
              <div key={b} className="animate-pulse" style={{ width: '2px', height: `${h}px`, background: 'var(--rose-main)', borderRadius: '1px', animationDelay: `${b * 0.12}s`, animationDuration: `${0.6 + b * 0.1}s` }} />
            ))}
          </div>
          Играет музыка
        </div>
      )}
    </div>
  );
}