(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Theme toggle (dark is the default) ----------
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
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

  // ---------- Pipeline: pulse travels along the wire as you scroll ----------
  var pipeline = document.querySelector('[data-pipeline]');
  if (pipeline) {
    var steps = Array.prototype.slice.call(pipeline.querySelectorAll('li:not(.pulse)'));
    var horizontal = window.matchMedia('(min-width: 900px)');
    var ticking = false;

    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      var rect = pipeline.getBoundingClientRect();
      var last = steps[steps.length - 1];
      var span = last ? Math.max(last.offsetTop, 1) : 1; // vertical wire length
      var p;
      if (reduceMotion) {
        p = 1;
      } else if (horizontal.matches) {
        // fills while the pipeline moves from 85% to 35% of the viewport height
        p = (vh * 0.85 - rect.top) / (vh * 0.5);
      } else {
        // vertical: the pulse follows the reading line at 60% of the viewport
        p = (vh * 0.6 - rect.top - 12) / span;
      }
      p = Math.min(Math.max(p, 0), 1);
      pipeline.style.setProperty('--p', p.toFixed(4));

      // wire ends at the last node on the vertical layout
      if (!horizontal.matches && last) {
        pipeline.style.setProperty('--wire-end', (pipeline.offsetHeight - last.offsetTop - 12) + 'px');
      }

      steps.forEach(function (li, i) {
        var at;
        if (horizontal.matches) {
          at = i / (steps.length - 1);
        } else {
          at = li.offsetTop / span;
        }
        li.classList.toggle('is-lit', p >= at - 0.001);
      });
    };

    var request = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
  }

  // ---------- Project cards: subtle tilt + glow following the pointer ----------
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var tile = card.querySelector('.project-tile');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
        if (tile) {
          var t = tile.getBoundingClientRect();
          tile.style.setProperty('--mx', (e.clientX - t.left) + 'px');
          tile.style.setProperty('--my', (e.clientY - t.top) + 'px');
        }
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

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
