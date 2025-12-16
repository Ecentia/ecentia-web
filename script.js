document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER ---
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

    // --- 2. CURSOR "ORBITAL PULSE" (MEJORADO) ---
    const canvas = document.getElementById('cursor-canvas');
    const mainCursor = document.getElementById('main-cursor');
    // Elementos magnéticos
    const magnetTargets = document.querySelectorAll('.magnet-target, a, button, input, textarea, .service-row, .project-visual'); 

    if (canvas && mainCursor) {
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let cursor = { x: width / 2, y: height / 2 };
        let particles = [];
        let ripples = []; // Array para las ondas expansivas
        
        // Forzamos estilos iniciales para asegurar que NO sea un rombo
        mainCursor.style.borderRadius = '50%';
        mainCursor.style.transform = 'translate(-50%, -50%)';

        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', initCanvas);
        initCanvas();

        // Recuperar posición
        const savedX = sessionStorage.getItem('cursorX');
        const savedY = sessionStorage.getItem('cursorY');
        if (savedX) cursor.x = parseFloat(savedX);
        if (savedY) cursor.y = parseFloat(savedY);

        const moveCursor = (x, y) => {
            mainCursor.style.left = `${x}px`;
            mainCursor.style.top = `${y}px`;
        };
        moveCursor(cursor.x, cursor.y);

        // Movimiento
        document.addEventListener('mousemove', e => {
            cursor.x = e.clientX;
            cursor.y = e.clientY;
            moveCursor(cursor.x, cursor.y);
            
            // Estela suave (menos partículas pero más fluidas)
            if(Math.random() > 0.5) addParticle(cursor.x, cursor.y, false);
        });

        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('cursorX', cursor.x);
            sessionStorage.setItem('cursorY', cursor.y);
        });

        // CLICK: Onda Expansiva (Ripple) + Contracción
        document.addEventListener('mousedown', () => {
            mainCursor.style.transform = "translate(-50%, -50%) scale(0.7)"; // Contracción rápida
            addRipple(cursor.x, cursor.y); // Crear onda
        });

        document.addEventListener('mouseup', () => {
            mainCursor.style.transform = "translate(-50%, -50%) scale(1)"; // Vuelta a la normalidad
        });

        // --- SISTEMA DE PARTÍCULAS ---
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 0.5;
                this.color = '168, 85, 247'; // Tu Accent Color
                
                // Movimiento aleatorio muy suave
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 0.5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                this.life = 1.0;
                this.decay = 0.02;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
                ctx.fill();
            }
        }

        // --- SISTEMA DE ONDAS (RIPPLES) ---
        class Ripple {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 5;
                this.maxRadius = 60; // Tamaño máximo de la onda
                this.speed = 3; // Velocidad de expansión
                this.life = 1.0; // Opacidad
                this.decay = 0.04; 
                this.color = '255, 255, 255'; // Onda blanca/brillante
            }

            update() {
                this.radius += this.speed;
                this.life -= this.decay;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${this.color}, ${this.life})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        function addParticle(x, y) { particles.push(new Particle(x, y)); }
        function addRipple(x, y) { ripples.push(new Ripple(x, y)); }

        // Render Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';

            // Dibujar Partículas
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0) { particles.splice(i, 1); i--; }
            }

            // Dibujar Ondas
            for (let i = 0; i < ripples.length; i++) {
                ripples[i].update();
                ripples[i].draw();
                if (ripples[i].life <= 0) { ripples.splice(i, 1); i--; }
            }

            requestAnimationFrame(animate);
        }
        animate();

        // Hover Effects
        magnetTargets.forEach(target => {
            target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // --- 3. RESTO DE FUNCIONES (Spotlight, Scroll, Forms...) ---
    
    // Spotlight Effect
    const cards = document.querySelectorAll('.spotlight-card');
    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Fade In Animations
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

    const fadeElements = document.querySelectorAll('.project-item, .card, .cta-title, .fade-in-up');
    fadeElements.forEach(el => {
        if (!el.classList.contains('no-js-anim')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Contact Form
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
                btn.innerHTML = '<span>Error Red</span> <i class="fas fa-wifi"></i>';
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