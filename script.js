(() => {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const links = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a[href^="#"]')];
  function closeMenu() {
    if (!toggle || !mobileNav) return;
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('menu-open');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      mobileNav.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
      document.body.classList.add('menu-open');
    }
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => {
        links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
      });
    }, {rootMargin: '-25% 0px -60% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
  }
})();
