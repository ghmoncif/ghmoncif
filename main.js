/* ─── NEURAL NETWORK CANVAS ──────────────────────────────────── */
(function initNeural() {
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CFG = {
    count:   75,
    maxDist: 140,
    speed:   0.35,
  };

  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
      this.vx = (Math.random() - 0.5) * CFG.speed;
      this.vy = (Math.random() - 0.5) * CFG.speed;
      this.r  = 1 + Math.random() * 2;
      this.violet = Math.random() > 0.45;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        this.x += (dx / d) * 0.9;
        this.y += (dy / d) * 0.9;
      }
      if (this.x < -10) this.x = canvas.width  + 5;
      if (this.x > canvas.width  + 10) this.x = -5;
      if (this.y < -10) this.y = canvas.height + 5;
      if (this.y > canvas.height + 10) this.y = -5;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.violet
        ? 'rgba(124, 58, 237, 0.7)'
        : 'rgba(34, 211, 238, 0.65)';
      ctx.fill();
    }
  }

  const particles = Array.from({ length: CFG.count }, () => new Particle());

  function drawEdges() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.maxDist) {
          const a = (1 - d / CFG.maxDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${a})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEdges();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ─── NAV SCROLL EFFECT ──────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE MENU ────────────────────────────────────────────── */
const navToggle  = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.classList.add('visible');
    }, i * 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ─── LANG BAR ANIMATION ─────────────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.lang-fill').forEach(fill => {
      fill.classList.add('animated');
    });
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.lang-list').forEach(el => barObserver.observe(el));

/* ─── TYPEWRITER ─────────────────────────────────────────────── */
(function typewriter() {
  const el      = document.querySelector('.typewriter');
  if (!el) return;
  const phrases = [
    'LLM Engineer.',
    'RAG Pipeline Builder.',
    'AI Engineering Student.',
    'ML Systems Developer.',
  ];
  let i = 0, j = 0, deleting = false;

  function tick() {
    const phrase = phrases[i % phrases.length];
    el.textContent = deleting ? phrase.slice(0, --j) : phrase.slice(0, ++j);

    if (!deleting && j === phrase.length) {
      deleting = true;
      setTimeout(tick, 2000);
      return;
    }
    if (deleting && j === 0) {
      deleting = false;
      i++;
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
})();

/* ─── COUNTER ANIMATION ──────────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = +el.dataset.target;
      let n = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n;
        if (n >= target) clearInterval(timer);
      }, 40);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

/* ─── CARD GLOW (MOUSE TRACK) ────────────────────────────────── */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width)  * 100}%`);
    card.style.setProperty('--mouse-y', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  });
});

/* ─── FOOTER YEAR ────────────────────────────────────────────── */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
