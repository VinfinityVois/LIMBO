/* П.Р.И.Н.Ц. shared system scripts v2 */
(function () {
  // Native cursor (custom lag cursor disabled)
  document.body.style.cursor = '';
  document.documentElement.style.cursor = '';

  // Periodic glitch flash
  const flash = document.createElement('div');
  flash.className = 'glitch-flash';
  document.body.appendChild(flash);

  const colors = ['#00fff9', '#ff00aa', '#000', '#9b00d4', '#e02848'];
  function screenGlitch() {
    const c = colors[Math.floor(Math.random() * colors.length)];
    flash.style.background = c;
    flash.style.opacity = '0.55';
    setTimeout(() => { flash.style.opacity = '0'; }, 50);
    setTimeout(() => {
      flash.style.background = colors[Math.floor(Math.random() * colors.length)];
      flash.style.opacity = '0.35';
      setTimeout(() => { flash.style.opacity = '0'; }, 60);
    }, 80);
  }

  function scheduleGlitch() {
    setTimeout(() => {
      if (Math.random() > 0.4) screenGlitch();
      scheduleGlitch();
    }, 9000 + Math.random() * 14000);
  }
  scheduleGlitch();

  // Stagger reveals
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.style.animationDelay) {
      el.style.animationDelay = (0.06 * (i % 8)) + 's';
    }
  });

  // IntersectionObserver for blur-reveal
  const blurEls = document.querySelectorAll('.blur-reveal');
  if (blurEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    blurEls.forEach((el) => io.observe(el));
  }

  // Ambient particle canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = Math.min(55, Math.floor((window.innerWidth * window.innerHeight) / 28000));
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.35,
      a: 0.08 + Math.random() * 0.2
    });
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    const offset = scrollY * 0.04;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y + offset * (p.r * 0.3), p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 232, ${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

})();
