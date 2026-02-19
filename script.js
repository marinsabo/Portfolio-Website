/* 
  MS Development - Core Interactions
*/

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
});

function initCustomCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (!cursorDot || !cursorOutline) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (using animate for smoothness)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            cursorOutline.style.mixBlendMode = 'exclusion';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.mixBlendMode = 'normal';
        });
    });
}

// Magnetic Button Logic
const magneticBtns = document.querySelectorAll('[data-magnetic]');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move the button itself
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

        // Move the inner text/content slightly less for parallax
        const text = btn.querySelector('.btn-text');
        if (text) {
            text.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        }
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        const text = btn.querySelector('.btn-text');
        if (text) {
            text.style.transform = 'translate(0, 0)';
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuCloseBtn = document.querySelector('.mobile-menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenu) {
    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Prevent scrolling when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Header Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Portfolio Item Click Handlers - Link to Case Studies
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function () {
        const caseStudyPages = [
            'gamechanger-case-study.html',
            'ikarus-case-study.html',
            'wavelance-case-study.html'
        ];
        if (caseStudyPages[index]) {
            window.location.href = caseStudyPages[index];
        }
    });
});

// Disable Right Click
document.addEventListener('contextmenu', (e) => e.preventDefault());

function ctrlShiftKey(e, keyCode) {
    return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

document.onkeydown = (e) => {
    // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
    if (
        event.keyCode === 123 ||
        ctrlShiftKey(e, 'I') ||
        ctrlShiftKey(e, 'J') ||
        ctrlShiftKey(e, 'C') ||
        (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
    ) {
        return false;
    }
};

// Reusable Infinite Carousel Logic
function setupInfiniteCarousel(sliderId, prevBtnSelector, nextBtnSelector) {
    const slider = document.getElementById(sliderId);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);

    if (!slider || !prevBtn || !nextBtn) return;

    const cards = Array.from(slider.children);
    if (cards.length === 0) return;

    const cardCount = cards.length;
    const cardsToClone = 3; // Number of items to clone for buffer

    // Clone items
    const firstClones = cards.slice(0, cardsToClone).map(card => card.cloneNode(true));
    const lastClones = cards.slice(-cardsToClone).map(card => card.cloneNode(true));

    // Append and Prepend clones
    firstClones.forEach(clone => slider.appendChild(clone));
    lastClones.reverse().forEach(clone => slider.prepend(clone));

    // Scroll to the first real element
    const alignSlider = () => {
        const firstCard = cards[0];
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 32; // Default to 32px if not set
        slider.scrollLeft = cardsToClone * (cardWidth + gap);
    };

    // Run initially and on resize
    window.addEventListener('load', alignSlider);
    window.addEventListener('resize', alignSlider);
    setTimeout(alignSlider, 100);

    // Scroll Event for Infinite Loop
    slider.addEventListener('scroll', () => {
        const firstCard = cards[0];
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 32;
        const itemWidth = cardWidth + gap;
        const totalRealWidth = cardCount * itemWidth;

        // If scrolled to the start (into prepended clones)
        if (slider.scrollLeft <= 10) {
            slider.scrollLeft = slider.scrollLeft + totalRealWidth;
        }
        // If scrolled to the end (into appended clones)
        else if (slider.scrollLeft >= totalRealWidth + (cardsToClone * itemWidth) - 10) {
            slider.scrollLeft = slider.scrollLeft - totalRealWidth;
        }
    });

    nextBtn.addEventListener('click', () => {
        const firstCard = cards[0]; // Use original REF for width measurement (or query selector)
        // Better to query current first child in case of resize updates on clones? 
        // Actually cards[0] is still in DOM but might be shifted? No, it's just a reference.
        // Let's us slider.children[0] or just re-measure.
        const currentFirst = slider.children[0];
        const cardWidth = currentFirst.offsetWidth;
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 32;

        slider.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        const currentFirst = slider.children[0];
        const cardWidth = currentFirst.offsetWidth;
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 32;

        slider.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    });
}
