document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER & ENTRADA ---
    const body = document.body;
    const barFill = document.querySelector('.bar-fill');
    
    // Simular carga
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width > 100) width = 100;
        barFill.style.width = width + '%';
        
        if (width === 100) {
            clearInterval(interval);
            setTimeout(() => {
                body.classList.add('loaded');
                body.classList.remove('loading');
            }, 500);
        }
    }, 100);

    // --- 2. CUSTOM CURSOR & MAGNET EFFECT ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    const magnetTargets = document.querySelectorAll('.magnet-target');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // El punto sigue al mouse instantáneamente
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // El círculo sigue con "lag" (Lerp)
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursorCircle.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Effects
    magnetTargets.forEach(target => {
        target.addEventListener('mouseenter', () => body.classList.add('hovering'));
        target.addEventListener('mouseleave', () => body.classList.remove('hovering'));
    });

    // --- 3. SPOTLIGHT EFFECT ON CARDS ---
    const cardsContainer = document.getElementById('cards-container');
    const cards = document.querySelectorAll('.spotlight-card');

    if (cardsContainer) {
        cardsContainer.addEventListener('mousemove', (e) => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // --- 4. SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px" };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos a animar que no sean el hero (ya animado por clase loaded)
    const fadeElements = document.querySelectorAll('.project-item, .card, .cta-title');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // --- 5. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});