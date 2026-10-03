(function () {
  'use strict';

  var root = document.documentElement;
  var lang = root.lang === 'hr' ? 'hr' : 'en';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile menu ----------
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('.menu-btn');
  if (header && menuBtn) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () {
      setOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    // close after following a link, or on Escape
    header.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        menuBtn.focus();
      }
    });
  }

  // ---------- Footer year ----------
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Shipped log (data/shipped.json is the single source) ----------
  var list = document.querySelector('[data-shipped-list]');
  var lastShipped = document.querySelector('[data-last-shipped]');
  var src = (document.querySelector('[data-shipped]') || {}).dataset;
  src = (src && src.shipped) || (lastShipped && lastShipped.dataset.lastShipped);

  if (src && (list || lastShipped)) {
    fetch(src)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var entries = data.entries || [];
        var shipped = entries.filter(function (e) { return e.status === 'shipped'; });

        if (lastShipped && shipped.length) lastShipped.textContent = shipped[0].date;
        if (!list) return;

        document.querySelectorAll('[data-shipped-count]').forEach(function (el) {
          el.textContent = shipped.length;
        });
        var countText = document.querySelector('[data-shipped-count-text]');
        if (countText) countText.textContent = shipped.length + ' ';
        var since = document.querySelector('[data-shipped-since]');
        if (since && data.since) since.textContent = data.since;

        list.textContent = '';
        entries.forEach(function (e) {
          var li = document.createElement('li');

          var date = document.createElement('span');
          date.className = 'log-date';
          date.textContent = e.date;

          var item = document.createElement('span');
          item.className = 'log-item';
          var title = document.createElement('strong');
          title.textContent = e.title;
          var note = document.createElement('span');
          note.textContent = ' — ' + ((e.note && (e.note[lang] || e.note.en)) || '');
          item.appendChild(title);
          item.appendChild(note);

          var dot = document.createElement('span');
          dot.className = 'log-dot' + (e.status === 'next' ? ' is-next' : '');
          dot.setAttribute('role', 'img');
          dot.setAttribute('aria-label', e.status === 'next'
            ? (lang === 'hr' ? 'u izradi' : 'in progress')
            : (lang === 'hr' ? 'isporučeno' : 'shipped'));

          li.appendChild(date);
          li.appendChild(item);
          li.appendChild(dot);
          list.appendChild(li);
        });
      })
      .catch(function () { /* keep the fallback text */ });
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
    var swap = function () { screenEl.innerHTML = screens[name]; };
    if (reduceMotion) {
      swap();
    } else {
      // a very short dip, like the terminal repainting
      screenEl.classList.add('is-switching');
      window.setTimeout(function () {
        swap();
        screenEl.classList.remove('is-switching');
      }, 60);
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
