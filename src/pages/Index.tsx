import { useState, useEffect, useRef } from 'react';

const SEA_IMG = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/156b9e86-9a69-47b2-9a98-c02d716abc79.jpg';
const HERO_IMG = 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/be10d329-f2c9-4c6f-b4aa-f14c54502053.jpg';

// Целевая дата встречи: 21 мая 2026, 20:30
const TARGET_DATE = new Date('2026-05-21T20:30:00');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ── Экран 1: море + кнопка Прочти ──
function HeroScreen({ onRead }: { onRead: () => void }) {
  const [btnVisible, setBtnVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBtnVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100dvh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Фон — море */}
      <img
        src={SEA_IMG}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {/* Тёмный градиент */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Контент */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '40px',
        padding: '0 24px', textAlign: 'center',
      }}>
        {/* Наше фото */}
        <div style={{
          width: '140px', height: '140px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          opacity: btnVisible ? 1 : 0,
          transform: btnVisible ? 'scale(1)' : 'scale(0.85)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Кнопка Прочти */}
        <button
          onClick={onRead}
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '999px',
            padding: '18px 56px',
            cursor: 'pointer',
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(22px, 5vw, 32px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'white',
            letterSpacing: '0.06em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            opacity: btnVisible ? 1 : 0,
            transform: btnVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s, background 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 48px rgba(0,0,0,0.35)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
          }}
        >
          прочти
        </button>
      </div>

      {/* Волны снизу */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '120px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ── Экран 2: письмо + кнопка ❤ ──
const LETTER_PARAGRAPHS = [
  'Привет, моя дорогая.',
  'Хочу сказать тебе, что ты так же остаёшься человеком, ради которого я хочу стараться быть лучше.',
  'Ты по-настоящему мне важна, как бы то ни было, и будешь ценнее с каждым днём.',
  'Я часто бывал где-то не прав и не понимал, какую тяжесть я приношу тебе.',
  'Но я хочу показать тебе, что и я — под страхом потерять тебя навсегда — перестал быть таким надоедливым дураком.',
  'Как я уже говорил, ты стала смыслом моей жизни за такой короткий срок, и за такой же короткий срок ушла.',
  'Так оставайся смыслом моего каждого вздоха и биения сердца.',
];

function LetterScreen({ onInvite }: { onInvite: () => void }) {
  const [visible, setVisible] = useState<number[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible([]);
    LETTER_PARAGRAPHS.forEach((_, i) => {
      setTimeout(() => setVisible(prev => [...prev, i]), 300 + i * 750);
    });
  }, []);

  const allShown = visible.includes(LETTER_PARAGRAPHS.length - 1);

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #0a0a14 0%, #1a0a1a 50%, #0f0a1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '60px 24px 80px',
    }}>

      {/* Звёзды */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            borderRadius: '50%',
            background: 'white',
            opacity: 0.2 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', width: '100%' }}>

        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '1px', height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,100,100,0.6))',
            margin: '0 auto 20px',
          }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255,150,150,0.6)',
          }}>
            для тебя
          </p>
        </div>

        {/* Карточка */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: 'clamp(32px, 6vw, 56px) clamp(28px, 6vw, 52px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {LETTER_PARAGRAPHS.map((p, i) => (
              <p key={i} style={{
                fontFamily: "'Cormorant', serif",
                fontSize: i === 0 ? 'clamp(28px, 6vw, 42px)' : 'clamp(17px, 3.5vw, 22px)',
                fontWeight: i === 0 ? 400 : 300,
                fontStyle: i === 0 ? 'italic' : 'normal',
                color: i === 0 ? 'rgba(255,200,200,1)' : 'rgba(255,255,255,0.82)',
                lineHeight: 1.65,
                opacity: visible.includes(i) ? 1 : 0,
                transform: visible.includes(i) ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 0.9s cubic-bezier(.22,.68,0,1.1), transform 0.9s cubic-bezier(.22,.68,0,1.1)',
              }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Кнопка сердца */}
        <div ref={btnRef} style={{
          marginTop: '56px',
          display: 'flex',
          justifyContent: 'center',
          opacity: allShown ? 1 : 0,
          transform: allShown ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1.2s ease 0.5s, transform 1.2s ease 0.5s',
        }}>
          <button
            onClick={onInvite}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '0',
            }}
          >
            <span style={{
              fontSize: 'clamp(48px, 12vw, 80px)',
              lineHeight: 1,
              filter: 'drop-shadow(0 0 24px rgba(220,40,40,0.7))',
              animation: allShown ? 'heartbeat 1.5s ease-in-out infinite' : 'none',
              display: 'block',
            }}>
              ❤️
            </span>
            <span style={{
              fontFamily: "'Cormorant', serif",
              fontSize: 'clamp(22px, 5vw, 32px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#ff4444',
              letterSpacing: '0.05em',
              textShadow: '0 0 20px rgba(255,60,60,0.5)',
            }}>
              Я хочу тебя увидеть
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Экран 3: приглашение + таймер ──
function InviteScreen() {
  const time = useCountdown(TARGET_DATE);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const units = [
    { label: 'дней', value: time.days },
    { label: 'часов', value: time.hours },
    { label: 'минут', value: time.minutes },
    { label: 'секунд', value: time.seconds },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #0a0a14 0%, #1a0510 50%, #0f0a1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Фоновое свечение */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,20,40,0.15) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Звёзды */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            borderRadius: '50%',
            background: 'white',
            opacity: 0.15 + Math.random() * 0.4,
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        {/* Иконка */}
        <div style={{
          fontSize: '52px',
          marginBottom: '32px',
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.8s, transform 0.8s',
          filter: 'drop-shadow(0 0 20px rgba(220,40,40,0.6))',
        }}>
          🌹
        </div>

        {/* Заголовок */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(255,120,120,0.7)',
          marginBottom: '20px',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.8s ease 0.2s',
        }}>
          ✦ приглашение
        </p>

        <h1 style={{
          fontFamily: "'Cormorant', serif",
          fontSize: 'clamp(38px, 8vw, 64px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'rgba(255,220,220,0.95)',
          lineHeight: 1.15,
          marginBottom: '48px',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
        }}>
          Встретимся?
        </h1>

        {/* Карточка деталей */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px 36px',
          border: '1px solid rgba(255,100,100,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          marginBottom: '40px',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s',
        }}>
          {[
            { icon: '📅', label: 'Дата', value: '21 мая' },
            { icon: '🕗', label: 'Время', value: '20:30' },
            { icon: '📍', label: 'Место', value: 'Ротонда на набережной' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: i < 2 ? '0 0 24px' : '0',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              marginBottom: i < 2 ? '24px' : '0',
            }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,120,120,0.6)',
                  marginBottom: '4px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: 'clamp(22px, 5vw, 30px)',
                  fontWeight: 400,
                  color: 'rgba(255,230,230,0.95)',
                }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Таймер */}
        <div style={{
          opacity: show ? 1 : 0,
          transition: 'opacity 0.9s ease 0.9s',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,120,120,0.55)',
            marginBottom: '20px',
          }}>
            до встречи осталось
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {units.map((u) => (
              <div key={u.label} style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '18px 20px 14px',
                border: '1px solid rgba(255,100,100,0.15)',
                minWidth: '72px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(28px, 6vw, 40px)',
                  fontWeight: 700,
                  color: 'rgba(255,180,180,0.95)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {pad(u.value)}
                </p>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,120,120,0.5)',
                  marginTop: '6px',
                }}>
                  {u.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Финальная подпись */}
        <p style={{
          fontFamily: "'Cormorant', serif",
          fontSize: 'clamp(16px, 3.5vw, 20px)',
          fontStyle: 'italic',
          color: 'rgba(255,180,180,0.55)',
          marginTop: '48px',
          opacity: show ? 1 : 0,
          transition: 'opacity 1s ease 1.2s',
        }}>
          жду тебя 🌹
        </p>
      </div>
    </div>
  );
}

// ── CSS анимации ──
const STYLES = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.3); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.18); }
    28% { transform: scale(1); }
    42% { transform: scale(1.12); }
    56% { transform: scale(1); }
  }
  html { scroll-behavior: smooth; }
`;

type Screen = 'hero' | 'letter' | 'invite';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('hero');
  const topRef = useRef<HTMLDivElement>(null);

  const goTo = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div ref={topRef}>
        {screen === 'hero' && <HeroScreen onRead={() => goTo('letter')} />}
        {screen === 'letter' && <LetterScreen onInvite={() => goTo('invite')} />}
        {screen === 'invite' && <InviteScreen />}
      </div>
    </>
  );
}
