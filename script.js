document.addEventListener('DOMContentLoaded', () => {
    
<<<<<<< Updated upstream
    // --- 1. LÓGICA MODO OSCURO/CLARO ---
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

    if (toggleBtn) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            body.classList.add('light-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
            if (event.matches) {
                body.classList.add('light-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                body.classList.remove('light-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
=======
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
>>>>>>> Stashed changes
            }
        });

<<<<<<< Updated upstream
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if(body.classList.contains('light-mode')){
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }

    // --- 2. CONTADOR REGRESIVO (Solo si existe el elemento) ---
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        const fixedTargetDate = new Date('2025-12-05T00:00:00').getTime();
        const updateTimer = setInterval(function() {
            const now = new Date().getTime();
            const distance = fixedTargetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if(document.getElementById("days")) document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
            if(document.getElementById("hours")) document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
            if(document.getElementById("mins")) document.getElementById("mins").innerHTML = minutes < 10 ? "0" + minutes : minutes;
            if(document.getElementById("secs")) document.getElementById("secs").innerHTML = seconds < 10 ? "0" + seconds : seconds;

            if (distance < 0) {
                clearInterval(updateTimer);
                countdownEl.innerHTML = "<div class='number' style='font-size: 2rem;'>¡YA ESTAMOS ONLINE!</div>";
            }
        }, 1000);
    }

    // --- 3. NEWSLETTER HOME (Solo si existe) ---
    const form = document.getElementById("newsletter-form");
    if (form) {
        const btn = document.getElementById("submit-btn");
        const originalBtnContent = btn.innerHTML;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            btn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            btn.style.opacity = '0.8';

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    btn.innerHTML = '<span>¡Suscrito!</span> <i class="fas fa-check"></i>';
                    btn.classList.add('btn-success');
                    form.reset();
                } else {
                    btn.innerHTML = '<span>Error.</span> <i class="fas fa-times"></i>';
                    btn.classList.add('btn-error');
                }
            }).catch(error => {
                btn.innerHTML = '<span>Fallo de red</span> <i class="fas fa-wifi"></i>';
                btn.classList.add('btn-error');
            }).finally(() => {
                setTimeout(() => {
                    btn.innerHTML = originalBtnContent;
                    btn.classList.remove('btn-success', 'btn-error');
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }, 3000);
            });
        });
    }

    // --- 4. SISTEMA DE COOKIES (COMPLETO) ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const denyBtn = document.getElementById('deny-cookies');

    // Verificar localStorage
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500); // Retraso para no ser invasivo al instante
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
            // Aquí podrías inicializar Google Analytics u otros scripts
            console.log('Cookies aceptadas: Scripts de rastreo activados.');
        });
    }

    if (denyBtn) {
        denyBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            cookieBanner.classList.remove('show');
            console.log('Cookies rechazadas: Solo cookies esenciales.');
        });
    }
=======
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
>>>>>>> Stashed changes
});