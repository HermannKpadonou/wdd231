// Fichier : scripts/main.js (Version unifiée et optimisée)

document.addEventListener('DOMContentLoaded', function() {

    // --- GESTION DES DATES DANS LE FOOTER ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        try {
            lastModifiedSpan.textContent = new Date(document.lastModified).toLocaleDateString('fr-FR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
        } catch (e) {
            console.error("Impossible de récupérer la date de dernière modification.");
        }
    }

    // --- GESTION DU MENU MOBILE (HAMBURGER) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('header nav ul');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isVisible = navMenu.classList.toggle('show');
            menuToggle.setAttribute('aria-expanded', isVisible);
            
            const icon = menuToggle.querySelector('i');
            if (isVisible) {
                icon.classList.replace('fa-bars', 'fa-times');
                menuToggle.setAttribute('aria-label', 'Fermer le menu');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });
    }
    
    // --- GESTION DU HEADER QUI SE RÉTRÉCIT AU DÉFILEMENT ---
    const header = document.getElementById('header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // --- ANIMATION DES COMPTEURS DE STATISTIQUES ---
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // 2 secondes
            let start = 0;
            const stepTime = Math.abs(Math.floor(duration / target));

            const timer = setInterval(() => {
                start += 1;
                counter.textContent = start;
                if (start === target) {
                    clearInterval(timer);
                }
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // Animer une seule fois
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
});