// CONFIGURACIÓN
const ease = 0.08;
let curr = 0;
let tar = 0;

// ELEMENTOS DOM
const sc = document.getElementById('sc');
const body = document.body;
const cur = document.querySelector('.cur');
const rev = document.querySelector('.rev');
const rImg = document.getElementById('revImg');
const mbg = document.getElementById('mbg');
const menu = document.getElementById('menu');

// 1. MOTOR DE SCROLL (INERCIA)
// Ajustar altura del body al contenido real
function upH() {
    body.style.height = sc.getBoundingClientRect().height + 'px';
}
new ResizeObserver(upH).observe(sc);
window.addEventListener('resize', upH);
window.addEventListener('scroll', () => tar = window.scrollY);

function loop() {
    curr += (tar - curr) * ease;
    // Efecto Skew (inclinación por velocidad)
    const skew = (tar - curr) * 0.005; 
    sc.style.transform = `translateY(-${curr}px) skewY(${skew}deg)`;
    requestAnimationFrame(loop);
}
loop();

// 2. CANVAS FLUIDO (PARTÍCULAS)
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
let w, h, pts = [];

function res() {
    w = cvs.width = window.innerWidth;
    h = cvs.height = window.innerHeight;
}
window.addEventListener('resize', res);
res();

class P {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }
    up() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    dr() {
        ctx.fillStyle = '#8b21de';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Crear 60 partículas
for (let i = 0; i < 60; i++) pts.push(new P());

function ani() {
    ctx.clearRect(0, 0, w, h);
    pts.forEach(p => {
        p.up();
        p.dr();
        // Dibujar conexiones
        pts.forEach(p2 => {
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(139, 33, 222, ${1 - d/150})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(ani);
}
ani();

// 3. INTERACCIONES & EVENTOS
// Cursor sigue al ratón
document.addEventListener('mousemove', e => {
    cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

// Menú Toggle
const toggleMenu = () => menu.classList.toggle('open');
document.getElementById('menuBtn').addEventListener('click', toggleMenu);
document.getElementById('closeBtn').addEventListener('click', toggleMenu);

// Efecto Hover en Enlaces del Menú (Cambio Fondo)
document.querySelectorAll('.m-link').forEach(l => {
    l.addEventListener('mouseenter', () => {
        mbg.src = l.dataset.img;
        mbg.style.opacity = 0.4;
    });
    l.addEventListener('mouseleave', () => {
        mbg.style.opacity = 0;
    });
});

// Proyectos: 3D Tilt y Reveal Imagen
document.querySelectorAll('.proj').forEach(el => {
    el.addEventListener('mouseenter', () => {
        rImg.src = el.dataset.img;
        rev.style.opacity = 1;
        cur.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        rev.style.opacity = 0;
        cur.classList.remove('active');
    });
    el.addEventListener('mousemove', e => {
        rev.style.left = e.clientX + 'px';
        rev.style.top = e.clientY + 'px';
        
        // Cálculo Tilt 3D
        let rx = (e.clientY / window.innerHeight - 0.5) * -20;
        let ry = (e.clientX / window.innerWidth - 0.5) * 20;
        rev.style.transform = `translate(-50%,-50%) perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(0.6)`;
    });
});

// Botones Magnéticos
document.querySelectorAll('.mag').forEach(b => {
    b.addEventListener('mousemove', e => {
        let r = b.getBoundingClientRect();
        let x = (e.clientX - (r.left + r.width / 2)) * 0.3;
        let y = (e.clientY - (r.top + r.height / 2)) * 0.3;
        b.style.transform = `translate(${x}px, ${y}px)`;
        cur.classList.add('active');
    });
    b.addEventListener('mouseleave', () => {
        b.style.transform = 'translate(0,0)';
        cur.classList.remove('active');
    });
});