(function () {
  'use strict';

  var root = document.documentElement;

  // ---------- Theme toggle ----------
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.dataset.theme ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
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
    screenEl.innerHTML = screens[name];
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
