document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA MODO OSCURO/CLARO ---
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = toggleBtn.querySelector('i');

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
        }
    });

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


    // --- 2. CONTADOR REGRESIVO FIJO ---
    // Establecemos una fecha objetivo FIJA. Por ejemplo, 14 días a partir de hoy (fecha en la que se crea el código).
    // Puedes cambiar esta fecha por la que quieras.
    const targetDate = new Date();
    // targetDate.setDate(targetDate.getDate() + 14); // Esto lo hacía relativo
    // Lo fijamos a una fecha específica: Año, Mes (0-11), Día, Hora, Minuto, Segundo
    // Por ejemplo, 14 días desde hoy (21 Nov 2025) sería el 5 de Diciembre de 2025.
    const fixedTargetDate = new Date('2025-12-05T00:00:00').getTime();


    const updateTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = fixedTargetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("mins").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("secs").innerHTML = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(updateTimer);
            document.getElementById("countdown").innerHTML = "<div class='number' style='font-size: 2rem;'>¡YA ESTAMOS ONLINE!</div>";
        }
    }, 1000);


    // --- 3. ENVÍO DE FORMULARIO (AJAX) ---
    const form = document.getElementById("newsletter-form");
    const btn = document.getElementById("submit-btn");
    const originalBtnContent = btn.innerHTML;

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        btn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        btn.style.opacity = '0.8';

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                btn.innerHTML = '<span>¡Suscrito!</span> <i class="fas fa-check"></i>';
                btn.classList.add('btn-success');
                form.reset();
            } else {
                response.json().then(data => {
                    btn.innerHTML = '<span>Error.</span> <i class="fas fa-times"></i>';
                    btn.classList.add('btn-error');
                });
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
    }

    form.addEventListener("submit", handleSubmit);
});