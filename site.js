/* Shared site behaviour: nav blur on scroll + scroll-reveal observer. */
(function () {
  function onScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var allowMotion = !window.matchMedia || window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    // No animation support / reduced motion / no observer → leave everything visible.
    if (!allowMotion || !('IntersectionObserver' in window)) return;

    // Hide start-state, then reveal as each enters the viewport.
    items.forEach(function (el) { el.classList.add('is-pre'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.remove('is-pre');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });

    // Safety net: if anything is still hidden after 3s, reveal it.
    setTimeout(function () {
      document.querySelectorAll('.reveal.is-pre').forEach(function (el) { el.classList.remove('is-pre'); });
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  // ---- Scroll-spy: highlight the nav link for the section in view ----
  function initSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav .links a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('active'); });
          var a = map[e.target.id];
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpy);
  } else {
    initSpy();
  }
})();
