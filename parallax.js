(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  const revealTargets = [
    '.work-head', '.project', '.about-kicker', '.about-title', '.about-copy',
    '.services-head', '.service-list article', '.experience-head', '.timeline article',
    '.stack-section > div', '.stack-grid span', '.contact-section .section-no',
    '.contact-section h2', '.contact-bottom', 'footer'
  ];

  document.documentElement.classList.add('motion-ready');

  if (reduced) {
    document.documentElement.classList.add('reduce-motion');
    return;
  }

  // Coordinated hero entrance.
  requestAnimationFrame(() => document.body.classList.add('hero-entered'));

  // Reusable one-time viewport reveals.
  const items = document.querySelectorAll(revealTargets.join(','));
  items.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${Math.min((i % 4) * 65, 195)}ms`);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -5% 0px' });
  items.forEach(el => observer.observe(el));

  // Compact translucent navigation after initial scroll.
  const nav = document.querySelector('.nav');
  let navTick = false;
  const updateNav = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 100);
    navTick = false;
  };
  window.addEventListener('scroll', () => {
    if (!navTick) {
      requestAnimationFrame(updateNav);
      navTick = true;
    }
  }, { passive: true });
  updateNav();

  // Desktop-only subtle hero depth.
  if (finePointer && window.innerWidth >= 900) {
    const hero = document.querySelector('.hero');
    const portrait = document.querySelector('.portrait-wrap');
    const blinds = document.querySelector('.blinds');
    const rail = document.querySelector('.right-rail');
    let mx = 0, my = 0, sy = window.scrollY, ticking = false;
    const render = () => {
      const progress = Math.min(sy / Math.max(hero?.offsetHeight || 1, 1), 1);
      if (portrait) portrait.style.transform = `translate3d(${mx * 5}px,${progress * 28 + my * 4}px,0) scale(${1 + progress * .012})`;
      if (blinds) blinds.style.transform = `translate3d(${mx * 7}px,${progress * 16 + my * 4}px,0) skewY(-2deg)`;
      if (rail) rail.style.transform = `translate3d(0,${progress * -10}px,0)`;
      ticking = false;
    };
    const queue = () => { if (!ticking) { requestAnimationFrame(render); ticking = true; } };
    window.addEventListener('scroll', () => { sy = window.scrollY; queue(); }, { passive:true });
    hero?.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      mx = ((e.clientX-r.left)/r.width-.5)*2;
      my = ((e.clientY-r.top)/r.height-.5)*2;
      queue();
    }, { passive:true });
    hero?.addEventListener('pointerleave', () => { mx=0; my=0; queue(); });
    render();
  }

  // Lightweight cursor-follow label for project cards.
  if (finePointer) {
    document.querySelectorAll('.project-visual').forEach(card => {
      const label = card.querySelector('.view');
      if (!label) return;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = Math.max(70, Math.min(r.width - 70, e.clientX-r.left));
        const y = Math.max(45, Math.min(r.height - 45, e.clientY-r.top));
        label.style.left = `${x}px`;
        label.style.bottom = 'auto';
        label.style.top = `${y}px`;
        label.style.transform = 'translate(-50%,-50%)';
      }, { passive:true });
      card.addEventListener('pointerleave', () => {
        label.removeAttribute('style');
      });
    });
  }

  // Fast internal-page fade transition without blocking navigation.
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 180);
    });
  });
})();