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
