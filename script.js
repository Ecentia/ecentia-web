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

    // --- 2. SPECTACULAR PARTICLE CURSOR (NUEVO) ---
    const canvas = document.getElementById('cursor-canvas');
    const mainCursor = document.getElementById('main-cursor');
    // Seleccionamos elementos interactivos para el efecto magnético/hover
    const magnetTargets = document.querySelectorAll('.magnet-target, a, button, input, textarea, .service-row, .project-visual'); 

    // Solo inicializamos si existe el canvas (para evitar errores en páginas que no lo tengan)
    if (canvas && mainCursor) {
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let cursor = { x: width / 2, y: height / 2 };
        let particles = [];
        
        // Configuración del Canvas responsivo
        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', initCanvas);
        initCanvas();

        // Recuperar posición si existe (para evitar salto inicial)
        const savedX = sessionStorage.getItem('cursorX');
        const savedY = sessionStorage.getItem('cursorY');
        if (savedX) cursor.x = parseFloat(savedX);
        if (savedY) cursor.y = parseFloat(savedY);

        // Mover el cursor principal (DOM - La mira técnica)
        const moveCursor = (x, y) => {
            mainCursor.style.left = `${x}px`;
            mainCursor.style.top = `${y}px`;
        };
        moveCursor(cursor.x, cursor.y); // Posición inicial

        // Event Listeners de Movimiento
        document.addEventListener('mousemove', e => {
            cursor.x = e.clientX;
            cursor.y = e.clientY;
            moveCursor(cursor.x, cursor.y);
            
            // Crear partículas al mover (Estela)
            addParticle(cursor.x, cursor.y, false);
        });

        // Guardar posición al salir de la página
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('cursorX', cursor.x);
            sessionStorage.setItem('cursorY', cursor.y);
        });

        // Efecto Click (Explosión de partículas)
        document.addEventListener('mousedown', () => {
            // Contracción visual del puntero
            mainCursor.style.transform = "translate(-50%, -50%) scale(0.8) rotate(45deg)";
            
            // Generar explosión
            for (let i = 0; i < 12; i++) {
                addParticle(cursor.x, cursor.y, true);
            }
        });

        document.addEventListener('mouseup', () => {
            // Restaurar transform según si es hover o no
            const isHovering = document.body.classList.contains('hovering');
            mainCursor.style.transform = isHovering 
                ? "translate(-50%, -50%) scale(1) rotate(0deg)" 
                : "translate(-50%, -50%) scale(1) rotate(45deg)";
        });

        // Clase Partícula
        class Particle {
            constructor(x, y, isExplosion) {
                this.x = x;
                this.y = y;
                // Las de explosión son más grandes
                this.size = isExplosion ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5; 
                
                // Colores: Accent (Violeta), Índigo y Blanco
                const colors = ['168, 85, 247', '99, 102, 241', '255, 255, 255']; 
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                // Física de movimiento
                const angle = Math.random() * Math.PI * 2;
                const speed = isExplosion ? Math.random() * 5 + 2 : Math.random() * 0.5;
                
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                this.life = 1.0; // Opacidad inicial
                this.decay = isExplosion ? 0.03 : 0.015; // Velocidad de desvanecimiento
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

        function addParticle(x, y, isExplosion) {
            particles.push(new Particle(x, y, isExplosion));
        }

        // Loop de Animación (Render)
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            // Efecto de fusión de luz (Glow)
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Eliminar partículas muertas para optimizar memoria
                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Hover Effects (Cambio de forma del cursor)
        magnetTargets.forEach(target => {
            target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // --- 3. RESTO DE FUNCIONES (SPOTLIGHT, SCROLL, ETC) ---
    
    // Efecto Spotlight en Cards
    const cardsContainer = document.getElementById('cards-container'); // Mantener por compatibilidad si existe
    const cards = document.querySelectorAll('.spotlight-card'); // Selecciona cualquier tarjeta con efecto spotlight

    // Escuchamos mousemove en todo el documento para las cards que puedan estar dispersas
    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Intersection Observer para animaciones Fade-In
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
        // Solo aplicar si no tiene ya estilos inline que lo contradigan o clases de animación CSS puras
        if (!el.classList.contains('no-js-anim')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        }
    });

    // Smooth Scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Manejo del Formulario de Contacto
    const contactForm = document.getElementById("main-contact-form");
    if (contactForm) {
        const btn = document.getElementById("submit-btn");
        // Guardar el contenido original del botón (con spans e iconos)
        const originalBtnContent = btn.innerHTML;

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            
            // Estado de carga
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
                // Restaurar botón después de 4 segundos
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