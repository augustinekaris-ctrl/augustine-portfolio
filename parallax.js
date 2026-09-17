(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || window.innerWidth < 768) return;

  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.portrait-wrap');
  const copy = document.querySelector('.hero .copy');
  const blinds = document.querySelector('.blinds');
  const rail = document.querySelector('.right-rail');
  if (!hero) return;

  let scrollY = window.scrollY;
  let mouseX = 0;
  let mouseY = 0;
  let ticking = false;

  const render = () => {
    const progress = Math.min(scrollY / Math.max(hero.offsetHeight, 1), 1);
    if (portrait) portrait.style.transform = `translate3d(${mouseX * 8}px, ${progress * 34 + mouseY * 5}px, 0) scale(${1 + progress * 0.018})`;
    if (copy) copy.style.transform = `translate3d(${mouseX * -3}px, ${progress * -20 + mouseY * -2}px, 0)`;
    if (blinds) blinds.style.transform = `translate3d(${mouseX * 12}px, ${progress * 18 + mouseY * 7}px, 0) skewY(-2deg)`;
    if (rail) rail.style.transform = `translate3d(0, ${progress * -12}px, 0)`;
    ticking = false;
  };

  const requestRender = () => {
    if (!ticking) {
      requestAnimationFrame(render);
      ticking = true;
    }
  };

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    requestRender();
  }, { passive: true });

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    requestRender();
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    mouseX = 0;
    mouseY = 0;
    requestRender();
  });

  render();
})();