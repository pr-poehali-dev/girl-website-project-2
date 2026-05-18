import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMG = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/be10d329-f2c9-4c6f-b4aa-f14c54502053.jpg';
const IMG2 = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/cd847a8a-5d19-4505-b9e6-059639efe8c6.jpg';
const IMG3 = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/13866e00-0dfc-4597-8e2d-98b5f8c91760.jpg';

const TIMELINE = [
  { date: '14 февраля 2022', title: 'Первая встреча', desc: 'Тот самый день, когда всё изменилось. Взгляды встретились — и мир стал другим.', emoji: '🌹' },
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

const DOTS = Array.from({ length: 24 });

// ─── Falling petals ───
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${5 + i * 6.5}%`,
  size: 14 + Math.random() * 10,
  duration: 8 + Math.random() * 7,
  delay: Math.random() * 10,
  rotate: Math.random() > 0.5,
}));

function Petals() {
  return (
    <>
      {PETALS.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          🌸
        </div>
      ))}
    </>
  );
}

// ─── Section wrapper ───
function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative z-10 py-28 px-6 ${className}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color, fontSize: '10px' }}>
      — {children}
    </p>
  );
}

export default function Index() {
  const [view, setView] = useState<'home' | 'main' | 'path'>('home');
  const [btnXFlipped, setBtnXFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
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

  // Trigger reveal after view change
  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    }, 100);
  }, [view]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--cream)' }}>
      <Petals />

      {/* Soft blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,214,224,0.5) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-15%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(255,179,198,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255,240,244,0.6) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3" type="audio/mpeg" />
      </audio>

      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-white' : ''}`}
        style={{ padding: scrolled ? '12px 24px' : '20px 24px' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => { setView('home'); scrollToTop(); }}
            style={{ fontFamily: "'Cormorant', serif", fontWeight: 600, fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' }}
            className="rose-gradient-text"
          >
            М&nbsp;&amp;&nbsp;А
          </button>
          <div className="flex items-center gap-2">
            {view !== 'home' && (
              <button
                onClick={() => { setView('home'); scrollToTop(); }}
                className="nav-link transition-colors duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.1em', fontSize: '11px', textTransform: 'uppercase', fontWeight: 400, color: 'var(--rose-text)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}
              >
                ← Назад
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ════════════════════════════
          HOME VIEW
      ════════════════════════════ */}
      {view === 'home' && (
        <div>
          {/* HERO — full screen photo fading into buttons */}
          <div className="relative w-full" style={{ minHeight: '100vh' }}>
            {/* Photo */}
            <div className="sticky top-0 w-full" style={{ height: '100vh', zIndex: 0 }}>
              <img
                src={HERO_IMG}
                alt="Главное фото"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.85) brightness(0.95)' }}
              />
              {/* Gradient fade bottom — photo dissolves into cream */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,250,249,0) 0%, rgba(255,250,249,0) 40%, rgba(255,250,249,0.6) 65%, rgba(255,250,249,1) 100%)',
                }}
              />
              {/* Subtle top overlay for nav readability */}
              <div className="absolute top-0 left-0 right-0" style={{ height: '120px', background: 'linear-gradient(to bottom, rgba(255,250,249,0.3), transparent)' }} />
            </div>

            {/* Content overlaid on bottom of hero */}
            <div
              className="absolute bottom-0 left-0 right-0 z-10 text-center"
              style={{ paddingBottom: '48px' }}
            >
              {/* Names */}
              <h1
                className="animate-fadeInUp"
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: 'clamp(56px, 12vw, 120px)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: 'white',
                  textShadow: '0 2px 40px rgba(100,20,30,0.25)',
                  marginBottom: '8px',
                  opacity: 0,
                }}
              >
                М&nbsp;&amp;&nbsp;А
              </h1>
              <p
                className="animate-fadeInUp delay-200"
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: 'clamp(14px, 3vw, 20px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.15em',
                  textShadow: '0 1px 12px rgba(100,20,30,0.3)',
                  marginBottom: '8px',
                  opacity: 0,
                }}
              >
                наша история
              </p>
            </div>
          </div>

          {/* BUTTONS SECTION — appears after photo fades */}
          <div
            className="relative z-10"
            style={{
              background: 'var(--cream)',
              paddingTop: '20px',
              paddingBottom: '80px',
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            <div className="max-w-sm mx-auto flex flex-col gap-4 items-center">

              {/* ── Кнопка 1: ГЛАВНАЯ ── */}
              <button
                onClick={() => setView('main')}
                className="animate-fadeInUp delay-300 w-full glass-rose rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 text-left"
                style={{
                  opacity: 0,
                  padding: '20px 24px',
                  border: '1px solid rgba(255,179,198,0.5)',
                  boxShadow: '0 4px 20px rgba(232,103,122,0.1)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '4px' }}>
                      ✦ раздел
                    </p>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '26px', fontWeight: 400, color: 'var(--rose-text)' }}>
                      Главная
                    </p>
                  </div>
                  <Icon name="Heart" size={20} style={{ color: 'var(--rose-mid)' }} />
                </div>
              </button>

              {/* ── Кнопка 2: НАШ ПУТЬ ── */}
              <button
                onClick={() => setView('path')}
                className="animate-fadeInUp delay-500 w-full glass-rose rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 text-left"
                style={{
                  opacity: 0,
                  padding: '20px 24px',
                  border: '1px solid rgba(255,179,198,0.5)',
                  boxShadow: '0 4px 20px rgba(232,103,122,0.1)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '4px' }}>
                      ✦ раздел
                    </p>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '26px', fontWeight: 400, color: 'var(--rose-text)' }}>
                      Наш путь
                    </p>
                  </div>
                  <Icon name="Map" size={20} style={{ color: 'var(--rose-mid)' }} />
                </div>
              </button>

              {/* ── Кнопка 3: КНОПКА Х (большая, главная) ── */}
              <button
                onClick={() => setBtnXFlipped(f => !f)}
                className="animate-fadeInUp delay-700 w-full rounded-3xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] animate-breathe relative overflow-hidden"
                style={{
                  opacity: 0,
                  padding: '32px 28px',
                  background: 'linear-gradient(135deg, var(--rose-main) 0%, var(--rose-deep) 100%)',
                  boxShadow: '0 8px 32px rgba(232,103,122,0.35)',
                  minHeight: '130px',
                  perspective: '800px',
                }}
              >
                {/* Shimmer layer */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="text-left">
                    <div className="animate-heartbeat mb-2" style={{ display: 'inline-block', fontSize: '28px' }}>💝</div>
                    <div key={String(btnXFlipped)} className="btn-x-text">
                      {!btnXFlipped ? (
                        <>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            ✦ особое
                          </p>
                          <p style={{ fontFamily: "'Cormorant', serif", fontSize: '32px', fontWeight: 400, color: 'white', lineHeight: 1.1 }}>
                            Кнопка Х
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                            ✦ скоро здесь будет
                          </p>
                          <p style={{ fontFamily: "'Cormorant', serif", fontSize: '22px', fontWeight: 300, color: 'white', lineHeight: 1.4, fontStyle: 'italic' }}>
                            Что-то очень важное для нас двоих…
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <Icon name="Sparkles" size={28} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginLeft: '12px' }} />
                </div>
              </button>

              {/* Hint */}
              <p className="animate-fadeInUp delay-900 text-center" style={{ opacity: 0, fontSize: '11px', color: 'var(--rose-main)', letterSpacing: '0.1em', marginTop: '4px' }}>
                нажми на кнопку Х ✦
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          MAIN VIEW (Главная — точки-заглушки)
      ════════════════════════════ */}
      {view === 'main' && (
        <div style={{ paddingTop: '80px' }}>
          <Section id="main-content">
            <div className="reveal text-center mb-16">
              <SectionLabel color="var(--rose-main)">Главная</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 300, color: 'var(--rose-text)', lineHeight: 1.1 }}>
                Наша <em style={{ fontStyle: 'italic', color: 'var(--rose-main)' }}>история</em>
              </h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: 'var(--rose-main)', opacity: 0.6, marginTop: '12px', letterSpacing: '0.1em' }}>
                — здесь скоро появится ваш рассказ —
              </p>
            </div>

            {/* Dot placeholders */}
            <div className="reveal">
              <div className="glass-rose rounded-3xl p-10 md:p-14 mb-6" style={{ border: '1px solid rgba(255,179,198,0.4)' }}>
                <div className="dot-grid flex flex-wrap gap-3 justify-center mb-8">
                  {DOTS.map((_, i) => (
                    <span key={i} style={{ animationDelay: `${i * 0.04}s` }} />
                  ))}
                </div>
                <div className="space-y-4">
                  {[80, 65, 90, 55, 75].map((w, i) => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        height: '10px',
                        width: `${w}%`,
                        background: 'linear-gradient(90deg, var(--rose-soft), var(--rose-mid))',
                        opacity: 0.5 + i * 0.05,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-center mt-8" style={{ fontFamily: "'Cormorant', serif", fontSize: '20px', fontStyle: 'italic', color: 'var(--rose-main)', opacity: 0.7 }}>
                  Скоро здесь появится ваш текст…
                </p>
              </div>

              {/* Photo preview */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {GALLERY.slice(0, 4).map((item, i) => (
                  <div key={i} className="gallery-item" style={{ height: '200px' }}>
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                    <div className="gallery-overlay">
                      <span className="text-white font-light text-sm" style={{ fontFamily: "'Cormorant', serif" }}>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ════════════════════════════
          PATH VIEW (Наш путь — таймлайн)
      ════════════════════════════ */}
      {view === 'path' && (
        <div style={{ paddingTop: '80px' }}>
          <Section id="path-content">
            <div className="reveal text-center mb-16">
              <SectionLabel color="var(--rose-main)">Наш путь</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 300, color: 'var(--rose-text)', lineHeight: 1.1 }}>
                Шаг за <em style={{ fontStyle: 'italic', color: 'var(--rose-main)' }}>шагом</em>
              </h2>
            </div>

            <div className="reveal space-y-10 max-w-2xl mx-auto">
              {TIMELINE.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot">{item.emoji}</div>
                  <div
                    className="glass-rose rounded-2xl p-6 ml-4"
                    style={{ border: '1px solid rgba(255,179,198,0.4)', boxShadow: '0 4px 20px rgba(232,103,122,0.07)' }}
                  >
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose-main)', marginBottom: '6px' }}>
                      {item.date}
                    </p>
                    <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: '24px', fontWeight: 400, color: 'var(--rose-text)', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: 'var(--rose-text)', opacity: 0.7, lineHeight: 1.7, fontWeight: 300 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote at bottom */}
            <div className="reveal text-center mt-20">
              <div className="glass-rose rounded-3xl px-10 py-10 inline-block" style={{ border: '1px solid rgba(255,179,198,0.4)' }}>
                <div className="animate-float" style={{ fontSize: '36px', marginBottom: '12px' }}>🌹</div>
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--rose-text)', lineHeight: 1.5 }}>
                  «Каждый момент с тобой — мой любимый»
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 px-6">
        <div className="h-px max-w-xs mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--rose-mid), transparent)' }} />
        <p style={{ fontFamily: "'Cormorant', serif", fontSize: '16px', color: 'var(--rose-main)', opacity: 0.6 }}>
          Сделано с любовью 🌸
        </p>
      </footer>

      {/* Music btn */}
      <button onClick={toggleMusic} className={`music-btn ${isPlaying ? 'playing' : ''}`} title={isPlaying ? 'Выключить музыку' : 'Включить музыку'}>
        <Icon name={isPlaying ? 'Music' : 'Music2'} size={20} className="text-white" />
      </button>

      {isPlaying && (
        <div
          className="fixed bottom-24 right-4 glass-white rounded-full px-4 py-2 flex items-center gap-2 animate-fadeIn"
          style={{ fontSize: '11px', color: 'var(--rose-main)', border: '1px solid rgba(255,179,198,0.4)' }}
        >
          <div className="flex items-end gap-0.5" style={{ height: '14px' }}>
            {[8, 14, 6, 12].map((h, b) => (
              <div
                key={b}
                className="rounded-full animate-pulse"
                style={{ width: '2px', height: `${h}px`, background: 'var(--rose-main)', animationDelay: `${b * 0.12}s`, animationDuration: `${0.6 + b * 0.1}s` }}
              />
            ))}
          </div>
          Играет музыка
        </div>
      )}
    </div>
  );
}
