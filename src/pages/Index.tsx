import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const IMAGES = {
  hero: 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/be10d329-f2c9-4c6f-b4aa-f14c54502053.jpg',
  gallery1: 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/cd847a8a-5d19-4505-b9e6-059639efe8c6.jpg',
  gallery2: 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/13866e00-0dfc-4597-8e2d-98b5f8c91760.jpg',
  gallery3: 'https://cdn.poehali.dev/projects/df45a024-27f3-40de-a783-40db88f9c1e6/files/be10d329-f2c9-4c6f-b4aa-f14c54502053.jpg',
};

const NAV_ITEMS = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'О нас' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'history', label: 'История' },
  { id: 'contacts', label: 'Контакты' },
];

const TIMELINE = [
  { date: '14 февраля 2022', title: 'Первая встреча', desc: 'Тот самый день, когда всё изменилось. Взгляды встретились — и мир стал другим.' },
  { date: '1 мая 2022', title: 'Первое путешествие', desc: 'Мы открыли для себя новые места и поняли: вдвоём любой маршрут становится приключением.' },
  { date: '14 февраля 2023', title: 'Год вместе', desc: 'Первая годовщина. Столько воспоминаний, столько смеха и тепла.' },
  { date: '2024', title: 'Наши планы', desc: 'Впереди — ещё больше путешествий, открытий и счастливых моментов вместе.' },
];

const GALLERY_ITEMS = [
  { img: IMAGES.gallery1, label: 'Романтический вечер' },
  { img: IMAGES.gallery2, label: 'Городские прогулки' },
  { img: IMAGES.gallery3, label: 'Вместе' },
  { img: IMAGES.hero, label: 'Наш портрет' },
];

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map(n => document.getElementById(n.id));
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }

      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--dark-bg)' }}>
      <Stars />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{
          position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(180,79,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-20%', width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(255,45,120,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      <audio ref={audioRef} loop>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass' : ''}`}
        style={{ paddingTop: scrolled ? '12px' : '20px', paddingBottom: scrolled ? '12px' : '20px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div onClick={() => scrollTo('home')} className="cursor-pointer">
            <span className="gradient-text" style={{ fontFamily: "'Cormorant', serif", fontWeight: 600, fontSize: '22px' }}>
              М&nbsp;&amp;&nbsp;А
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link transition-colors duration-300 ${
                  activeSection === item.id ? 'active neon-text-violet' : 'text-white/60 hover:text-white'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.1em', fontSize: '11px', textTransform: 'uppercase', fontWeight: 300 }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button className="md:hidden text-white/70 hover:text-white transition-colors" onClick={() => setNavOpen(!navOpen)}>
            <Icon name={navOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden glass mt-4 mx-4 rounded-2xl p-6 flex flex-col gap-4">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-left ${activeSection === item.id ? 'neon-text-violet' : 'text-white/70'}`}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.hero} alt="Hero" className="w-full h-full object-cover opacity-30" style={{ filter: 'saturate(0.8)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,15,0.3) 0%, rgba(8,8,15,0.6) 60%, rgba(8,8,15,1) 100%)' }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="animate-fadeInUp delay-100 text-sm tracking-[0.4em] uppercase mb-4"
            style={{ color: 'var(--neon-teal)', fontFamily: "'Montserrat', sans-serif", opacity: 0, fontSize: '11px' }}>
            ❤ Добро пожаловать ❤
          </p>

          <h1 className="animate-fadeInUp delay-200 mb-6" style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(52px, 10vw, 100px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            opacity: 0,
          }}>
            <span className="gradient-text animate-gradient">Наша</span>
            <br />
            <span style={{ color: 'white' }}>История</span>
          </h1>

          <p className="animate-fadeInUp delay-400 font-light text-white/60 max-w-md mx-auto mb-10" style={{ opacity: 0, fontSize: '15px' }}>
            Страница, где живут наши самые тёплые воспоминания, моменты и чувства
          </p>

          <div className="animate-fadeInUp delay-600 flex flex-col sm:flex-row gap-4 justify-center" style={{ opacity: 0 }}>
            <button
              onClick={() => scrollTo('about')}
              className="px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-violet))',
                boxShadow: '0 0 30px rgba(180,79,255,0.4)',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Узнать нас
            </button>
            <button
              onClick={() => scrollTo('gallery')}
              className="px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
              style={{
                border: '1px solid rgba(180,79,255,0.4)',
                color: 'rgba(255,255,255,0.8)',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Галерея
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float opacity-50">
          <Icon name="ChevronDown" size={24} className="text-white/50" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--neon-violet)', fontSize: '10px' }}>
                — О нас
              </p>
              <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, lineHeight: 1.15, color: 'white', marginBottom: '24px' }}>
                Двое, которые<br />
                <em style={{ color: 'var(--neon-pink)', fontStyle: 'italic' }}>нашли друг друга</em>
              </h2>
              <p className="text-white/60 font-light leading-relaxed mb-6" style={{ fontSize: '15px' }}>
                Мы — Маша и Антон. Встретились случайно, а оказалось — судьба. Вместе мы открываем мир, смеёмся над мелочами и создаём моменты, которые останутся с нами навсегда.
              </p>
              <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '15px' }}>
                Эта страница — наш маленький цифровой альбом. Здесь мы собираем всё самое важное: фотографии, истории, даты, которые изменили нашу жизнь.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10">
                {[{ num: '2+', label: 'Года вместе' }, { num: '12', label: 'Путешествий' }, { num: '∞', label: 'Планов' }].map(stat => (
                  <div key={stat.label} className="glass-violet rounded-2xl p-4 text-center">
                    <div className="gradient-text mb-1" style={{ fontFamily: "'Cormorant', serif", fontSize: '32px', fontWeight: 300 }}>{stat.num}</div>
                    <div className="text-white/50 text-xs tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden" style={{ height: '480px', border: '1px solid rgba(180,79,255,0.2)' }}>
                <img src={IMAGES.hero} alt="О нас" className="w-full h-full object-cover" style={{ filter: 'saturate(0.9)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,15,0.5) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-violet rounded-2xl px-6 py-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-sm text-white/80 font-light">💜 С любовью, каждый день</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--neon-teal)', fontSize: '10px' }}>— Галерея</p>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, color: 'white' }}>
              Наши <em className="gradient-text" style={{ fontStyle: 'italic' }}>моменты</em>
            </h2>
          </div>

          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`gallery-item ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ height: i === 0 ? '400px' : '190px' }}
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                <div className="gallery-overlay">
                  <span className="text-white font-light text-sm" style={{ fontFamily: "'Cormorant', serif" }}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section id="history" className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--neon-pink)', fontSize: '10px' }}>— История</p>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, color: 'white' }}>
              Наш <em className="gradient-text" style={{ fontStyle: 'italic' }}>путь</em>
            </h2>
          </div>

          <div className="reveal space-y-10">
            {TIMELINE.map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="glass-violet rounded-2xl p-6 ml-4">
                  <p className="tracking-widest uppercase mb-2" style={{ color: 'var(--neon-teal)', fontSize: '10px', letterSpacing: '0.2em' }}>{item.date}</p>
                  <h3 className="text-white font-light mb-3" style={{ fontFamily: "'Cormorant', serif", fontSize: '22px' }}>{item.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed" style={{ fontSize: '14px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="relative z-10 py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="reveal glass rounded-3xl p-10 md:p-14 text-center" style={{ border: '1px solid rgba(180,79,255,0.2)' }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--neon-violet)', fontSize: '10px' }}>— Контакты</p>
            <h2 className="mb-6" style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 300, color: 'white' }}>
              Свяжитесь с нами
            </h2>
            <p className="text-white/50 font-light mb-10" style={{ fontSize: '15px', lineHeight: 1.7 }}>
              Хотите познакомиться? Просто напишите — мы всегда рады общению.
            </p>

            <div className="space-y-4">
              {[
                { icon: 'Instagram', label: '@masha_i_anton', href: '#' },
                { icon: 'Mail', label: 'hello@example.com', href: 'mailto:hello@example.com' },
                { icon: 'MessageCircle', label: 'Telegram', href: '#' },
              ].map(contact => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center gap-4 glass rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] group"
                  style={{ border: '1px solid rgba(180,79,255,0.15)', textDecoration: 'none' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-violet))' }}>
                    <Icon name={contact.icon} size={18} className="text-white" />
                  </div>
                  <span className="text-white/80 font-light group-hover:text-white transition-colors">{contact.label}</span>
                  <Icon name="ArrowRight" size={16} className="ml-auto text-white/30 group-hover:text-white/60 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 px-6">
        <div className="h-px max-w-xl mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(180,79,255,0.3), transparent)' }} />
        <p className="text-white/30 font-light" style={{ fontFamily: "'Cormorant', serif", fontSize: '16px' }}>
          Сделано с любовью 💜 2024
        </p>
      </footer>

      {/* Music button */}
      <button onClick={toggleMusic} className={`music-btn ${isPlaying ? 'playing' : ''}`} title={isPlaying ? 'Выключить музыку' : 'Включить музыку'}>
        <Icon name={isPlaying ? 'Music' : 'Music2'} size={22} className="text-white" />
      </button>

      {isPlaying && (
        <div className="fixed bottom-24 right-4 glass rounded-full px-4 py-2 text-xs text-white/60 flex items-center gap-2 animate-fadeIn"
          style={{ border: '1px solid rgba(180,79,255,0.2)' }}>
          <div className="flex items-end gap-0.5" style={{ height: '14px' }}>
            {[8, 14, 6, 12].map((h, b) => (
              <div key={b} className="w-0.5 bg-violet-400 rounded-full animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${b * 0.1}s`, animationDuration: `${0.6 + b * 0.1}s` }} />
            ))}
          </div>
          Играет музыка
        </div>
      )}
    </div>
  );
}