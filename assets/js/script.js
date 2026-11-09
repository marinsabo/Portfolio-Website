(function () {
  'use strict';

  var root = document.documentElement;
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

  // ---------- Shipped log (assets/data/shipped.json is the single source) ----------
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
          note.textContent = ' — ' + (e.note || '');
          item.appendChild(title);
          item.appendChild(note);

          var dot = document.createElement('span');
          dot.className = 'log-dot' + (e.status === 'next' ? ' is-next' : '');
          dot.setAttribute('role', 'img');
          dot.setAttribute('aria-label', e.status === 'next' ? 'in progress' : 'shipped');

          li.appendChild(date);
          li.appendChild(item);
          li.appendChild(dot);
          list.appendChild(li);
        });

        // Fold the older entries so the log doesn't dominate the page.
        var more = document.querySelector('[data-shipped-more]');
        var visible = 5;
        if (more && entries.length > visible) {
          var items = list.querySelectorAll('li');
          for (var i = visible; i < items.length; i++) items[i].hidden = true;
          more.textContent = 'Show all ' + entries.length;
          more.hidden = false;
          more.addEventListener('click', function () {
            for (var j = visible; j < items.length; j++) items[j].hidden = false;
            more.hidden = true;
            items[visible].setAttribute('tabindex', '-1');
            items[visible].focus();
          });
        }
      })
      .catch(function () { /* keep the fallback text */ });
  }

  // ---------- DartZ console ----------
  var consoleEl = document.querySelector('[data-console]');
  if (!consoleEl) return;

  var screenEl = consoleEl.querySelector('.console-screen');
  var buttons = consoleEl.querySelectorAll('.pf-keys button');
  var cmdForm = consoleEl.querySelector('[data-console-cmd]');
  var cmdInput = cmdForm && cmdForm.querySelector('input');
  var msgEl = consoleEl.querySelector('[data-console-msg]');

  // The league screen is rendered in the HTML; the rest live in hidden <pre>s.
  var screens = { league: { html: screenEl.innerHTML, summary: 'League standings.' } };
  ['match', 'player', 'tables', 'help', 'exit'].forEach(function (name) {
    var src = document.getElementById('screen-' + name);
    if (src) screens[name] = { html: src.innerHTML, summary: src.dataset.summary || '' };
  });

  var keyToScreen = { F1: 'help', F3: 'exit', F4: 'tables', F5: 'league', F6: 'match', F9: 'player' };
  var commands = {
    HELP: 'help', LEAGUE: 'league', MATCH: 'match', PLAYER: 'player',
    TABLES: 'tables', DB2: 'tables', EXIT: 'exit', END: 'exit'
  };
  Object.keys(keyToScreen).forEach(function (k) { commands[k] = keyToScreen[k]; });

  function say(text) {
    if (msgEl) msgEl.textContent = text;
  }

  function show(name) {
    if (!screens[name]) return;
    var swap = function () { screenEl.innerHTML = screens[name].html; };
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
      b.setAttribute('aria-pressed', keyToScreen[b.dataset.key] === name ? 'true' : 'false');
    });
    say(screens[name].summary);
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(keyToScreen[b.dataset.key]); });
  });

  // Real function keys work while the console has focus.
  consoleEl.addEventListener('keydown', function (e) {
    if (keyToScreen[e.key]) {
      e.preventDefault();
      show(keyToScreen[e.key]);
    }
  });

  // Typed commands, like the COMMAND ===> line on a real 3270.
  if (cmdForm && cmdInput) {
    cmdForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var cmd = cmdInput.value.trim().toUpperCase();
      cmdInput.value = '';
      if (!cmd) return;
      if (commands[cmd]) {
        show(commands[cmd]);
      } else if (cmd === 'RESUME' || cmd === 'CV') {
        say('DZR001I OPENING RESUME (PDF) IN A NEW TAB.');
        window.open(consoleEl.dataset.resume || 'assets/Marin-Sabo-CV.pdf', '_blank', 'noopener');
      } else if (cmd === 'CONTACT' || cmd === 'EMAIL') {
        say('DZC001I JUMPING TO CONTACT.');
        var contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        say('DZE999E UNKNOWN COMMAND ' + cmd.slice(0, 20) + '. TYPE HELP.');
      }
    });
  }
})();
