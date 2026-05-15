// NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// SCROLL REVEAL
const revealTargets = document.querySelectorAll(
  '.crisis-stat, .feat-card, .sc, .testi-card, .solution__pillars li, .transform__card, .how__step, .wt-slide'
);
revealTargets.forEach(el => el.classList.add('reveal'));
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealTargets.forEach(el => revealObs.observe(el));

// SCREEN FILTER
const filters = document.querySelectorAll('.flt');
const screens = document.querySelectorAll('.sc');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    screens.forEach(sc => {
      sc.classList.toggle('hidden', cat !== 'all' && sc.dataset.cat !== cat);
    });
  });
});

// LIGHTBOX
const lb        = document.getElementById('lb');
const lbOverlay = document.getElementById('lb-overlay');
const lbImg     = document.getElementById('lb-img');
const lbCap     = document.getElementById('lb-cap');
let lbList = [], lbIdx = 0;

function buildList() {
  lbList = [...document.querySelectorAll('.sc:not(.hidden)')].map(sc => ({
    src:   sc.querySelector('img').src,
    alt:   sc.querySelector('img').alt,
    label: sc.querySelector('p').textContent
  }));
}
function openLb(idx) {
  buildList(); lbIdx = idx; showSlide();
  lb.classList.add('open'); lbOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function showSlide() {
  const s = lbList[lbIdx];
  lbImg.src = s.src; lbImg.alt = s.alt; lbCap.textContent = s.label;
}
function closeLb() {
  lb.classList.remove('open'); lbOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

screens.forEach((sc, i) => {
  sc.addEventListener('click', () => {
    buildList();
    const vis = [...document.querySelectorAll('.sc:not(.hidden)')];
    openLb(vis.indexOf(sc));
  });
});

document.getElementById('lb-close').addEventListener('click', closeLb);
lbOverlay.addEventListener('click', closeLb);
document.getElementById('lb-prev').addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; showSlide(); });
document.getElementById('lb-next').addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbList.length; showSlide(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; showSlide(); }
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbList.length; showSlide(); }
});

// NUMBER COUNT-UP animation for crisis stats
const statNums = document.querySelectorAll('.crisis-stat__num');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const span = el.querySelector('span');
    const suffix = span ? span.textContent : '';
    const target = parseInt(el.textContent);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (span) el.appendChild(span);
      if (current >= target) clearInterval(timer);
    }, 35);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(n => countObs.observe(n));
