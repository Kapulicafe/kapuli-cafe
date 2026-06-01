// Lógica Principal de la UI

// Activar modo preview en la sesión si estamos en preview.html
if (window.location.pathname.includes('preview.html')) {
    sessionStorage.setItem('preview_active', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
    // 0. Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }

    // 1. Manejo del Header Transparente -> Sólido al hacer scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 1.5 Manejo del Menú Drawer Mobile
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Cerrar el drawer al hacer clic en un enlace
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // 2. Smooth Scrolling para los enlaces del nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // En caso de que sea el chatbot o similar
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Botón flotante del Chatbot ahora usa href directo en HTML

    // 4. Citas Zen Dinámicas
    const initZenQuotes = () => {
        const zenContainer = document.getElementById('zen-quote-container');
        if (!zenContainer) return;

        let currentIndex = Math.floor(Math.random() * 9); // Supports the current 9 quotes

        const renderQuote = () => {
            const currentZenQuotes = translations && translations.zenQuotes ? translations.zenQuotes : appTranslations['es'].zenQuotes;
            const quote = currentZenQuotes[currentIndex % currentZenQuotes.length];
            zenContainer.style.opacity = '0';
            zenContainer.style.transform = 'translateY(10px)';
            setTimeout(() => {
                zenContainer.innerHTML = `${quote.text} <span class="zen-quote-author">— ${quote.author} (<i>${quote.obra}</i>)</span>`;
                zenContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                zenContainer.style.opacity = '1';
                zenContainer.style.transform = 'translateY(0)';
            }, 400);
        };

        // Listen for language changes to re-render the quote
        document.addEventListener('languageChanged', renderQuote);

        renderQuote();

        // Rotación automática cada 7 segundos
        let intervalId = setInterval(() => {
            const currentZenQuotes = translations && translations.zenQuotes ? translations.zenQuotes : appTranslations['es'].zenQuotes;
            currentIndex = (currentIndex + 1) % currentZenQuotes.length;
            renderQuote();
        }, 7000);

        // Rotación manual al hacer clic
        zenContainer.style.cursor = 'pointer';
        zenContainer.title = 'Haz clic para ver la siguiente frase';
        zenContainer.addEventListener('click', () => {
            clearInterval(intervalId);
            const currentZenQuotes = translations && translations.zenQuotes ? translations.zenQuotes : appTranslations['es'].zenQuotes;
            currentIndex = (currentIndex + 1) % currentZenQuotes.length;
            renderQuote();
            
            // Reiniciar el intervalo automático
            intervalId = setInterval(() => {
                const currentZenQuotes = translations && translations.zenQuotes ? translations.zenQuotes : appTranslations['es'].zenQuotes;
                currentIndex = (currentIndex + 1) % currentZenQuotes.length;
                renderQuote();
            }, 7000);
        });
    };

    
    // 5. Mountain Dashboard
    const updateMountainWeather = () => {
        const mountainDashboard = document.getElementById('mountain-dashboard');
        if (mountainDashboard) {
            // Null checks para cada elemento de montaña
            const tempHuarazEl = document.getElementById('temp-huaraz');
            if (tempHuarazEl) tempHuarazEl.innerText = "18°C";
            const condHuarazEl = document.getElementById('cond-huaraz');
            if (condHuarazEl) condHuarazEl.innerText = "Despejado";

            const tempChurupEl = document.getElementById('temp-churup');
            if (tempChurupEl) tempChurupEl.innerText = "8°C";
            const condChurupEl = document.getElementById('cond-churup');
            if (condChurupEl) condChurupEl.innerText = "Nublado";

            const tempVallunaEl = document.getElementById('temp-valluna');
            if (tempVallunaEl) tempVallunaEl.innerText = "-4°C";
            const condVallunaEl = document.getElementById('cond-valluna');
            if (condVallunaEl) condVallunaEl.innerText = "Viento Fuerte";

            // Animación sutil de carga
            Array.from(mountainDashboard.children).forEach((child, index) => {
                child.animate([
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 500, delay: index * 100, fill: 'forwards' });
            });
        }
    };

    updateMountainWeather();
    initZenQuotes();


    // 8. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-text');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const siblings = Array.from(entry.target.parentNode.querySelectorAll('.reveal-text'));
                    const index = siblings.indexOf(entry.target);
                    // Si el elemento no es parte de un grupo contiguo en su parent, el indexOf podría ser 0
                    // pero si lo es, añadimos retraso escalonado.
                    const delayIndex = index !== -1 ? index : 0;
                    
                    entry.target.style.transitionDelay = `${delayIndex * 150}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

});
