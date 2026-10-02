(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Theme toggle (light is the default) ----------
  var toggle = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var applyTheme = function (next) {
    root.dataset.theme = next;
    if (themeMeta) themeMeta.setAttribute('content', next === 'dark' ? '#0f1012' : '#ffffff');
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
  };
  if (themeMeta && root.dataset.theme === 'dark') themeMeta.setAttribute('content', '#0f1012');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      // a soft cross-fade where the browser supports view transitions
      if (document.startViewTransition && !reduceMotion) {
        document.startViewTransition(function () { applyTheme(next); });
      } else {
        applyTheme(next);
      }
    });
  }

  // ---------- Header border on scroll ----------
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Footer year ----------
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- DartZ console ----------
  var consoleEl = document.querySelector('[data-console]');
  if (!consoleEl) return;

  var screenEl = consoleEl.querySelector('.console-screen');
  var buttons = consoleEl.querySelectorAll('.pf-keys button');

  // The league screen is rendered in the HTML; the rest live in <template>s.
  var screens = { league: screenEl.innerHTML };
  ['match', 'player', 'help', 'exit'].forEach(function (name) {
    var tpl = document.getElementById('screen-' + name);
    if (tpl) screens[name] = tpl.innerHTML;
  });

  var keyToScreen = { F1: 'help', F3: 'exit', F5: 'league', F6: 'match', F9: 'player' };

  function show(key) {
    var name = keyToScreen[key];
    if (!name || !screens[name]) return;
    var swap = function () { screenEl.innerHTML = screens[name]; };
    if (reduceMotion) {
      swap();
    } else {
      // a very short dip, like the terminal repainting
      screenEl.classList.add('is-switching');
      window.setTimeout(function () {
        swap();
        screenEl.classList.remove('is-switching');
      }, 80);
    }
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.key === key ? 'true' : 'false');
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.key); });
  });

  // Real function keys work while the console has focus.
  consoleEl.addEventListener('keydown', function (e) {
    if (keyToScreen[e.key]) {
      e.preventDefault();
      show(e.key);
    }
  });
})();
