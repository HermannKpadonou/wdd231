// Gestion de la date de dernière modification
document.getElementById('lastModified').textContent = document.lastModified;

// Gestion de l'année en cours
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// Navigation fluide
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Fermer le menu mobile si ouvert
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        }
    });
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ici vous ajouterez le code pour envoyer le formulaire
        // Pour l'instant, on simule un envoi réussi
        alert('Votre message a été envoyé avec succès ! Nous vous contacterons bientôt.');
        contactForm.reset();
    });
}

// Animation au défilement
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .service-item, .station-content, .contact-content');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialiser les styles d'animation
document.querySelectorAll('.product-card, .service-item, .station-content, .contact-content').forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Écouter l'événement de défilement
window.addEventListener('scroll', animateOnScroll);
// Déclencher une première fois au chargement
window.addEventListener('load', animateOnScroll);