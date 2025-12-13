document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER (Carga acelerada) ---
    const body = document.body;
    const barFill = document.querySelector('.bar-fill');
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 20; 
        if (width > 100) width = 100;
        if(barFill) barFill.style.width = width + '%';
        
        if (width === 100) {
            clearInterval(interval);
            setTimeout(() => {
                body.classList.add('loaded');
                body.classList.remove('loading');
            }, 300);
        }
    }, 50);

    // --- 2. CUSTOM CURSOR CON MEMORIA (PERSISTENCIA) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    const magnetTargets = document.querySelectorAll('.magnet-target');

    // Recuperar posición guardada o usar valores por defecto fuera de pantalla
    // Esto evita que empiece en (0,0) si venimos de otra página
    let savedX = sessionStorage.getItem('cursorX');
    let savedY = sessionStorage.getItem('cursorY');

    // Si hay datos guardados, empezamos ahí. Si no, fuera de pantalla.
    let mouseX = savedX ? parseFloat(savedX) : -100;
    let mouseY = savedY ? parseFloat(savedY) : -100;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Aplicar posición INICIAL INMEDIATA (sin animación)
    if (savedX && savedY) {
        body.classList.add('mouse-moved'); // Hacer visible inmediatamente
        if (cursorDot) cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        if (cursorCircle) cursorCircle.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    // Guardar posición al salir de la página (Navigating away)
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('cursorX', mouseX);
        sessionStorage.setItem('cursorY', mouseY);
    });

    // Actualizar coordenadas al mover
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Si es la primera vez que se mueve y no estaba visible, hacerlo visible
        if (!body.classList.contains('mouse-moved')) {
            body.classList.add('mouse-moved');
            cursorX = mouseX; 
            cursorY = mouseY;
        }
        
        // El punto sigue al instante
        if (cursorDot) {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
    });

    // Bucle de animación suave para el círculo
    function animateCursor() {
        // Lerp (suavizado)
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15; // Velocidad de seguimiento
        cursorY += dy * 0.15;
        
        if (cursorCircle) {
            cursorCircle.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Effects
    magnetTargets.forEach(target => {
        target.addEventListener('mouseenter', () => body.classList.add('hovering'));
        target.addEventListener('mouseleave', () => body.classList.remove('hovering'));
    });

    // --- 3. RESTO DE FUNCIONES (SPOTLIGHT, SCROLL, ETC) ---
    // (Se mantienen igual para no romper la web)
    
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

    const fadeElements = document.querySelectorAll('.project-item, .card, .cta-title');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const contactForm = document.getElementById("main-contact-form");
    if (contactForm) {
        const btn = document.getElementById("submit-btn");
        const originalBtnContent = btn.innerHTML;

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            btn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    btn.innerHTML = '<span>¡Enviado!</span> <i class="fas fa-check"></i>';
                    btn.classList.add('btn-success');
                    contactForm.reset();
                } else {
                    btn.innerHTML = '<span>Error</span> <i class="fas fa-times"></i>';
                    btn.classList.add('btn-error');
                }
            }).catch(error => {
                btn.classList.add('btn-error');
            }).finally(() => {
                setTimeout(() => {
                    btn.innerHTML = originalBtnContent;
                    btn.classList.remove('btn-success', 'btn-error');
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 4000);
            });
        });
    }
});