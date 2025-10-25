document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.getElementById('gallery-grid');

    if (galleryContainer) {
        galleryContainer.addEventListener('click', function (e) {
            // Empêche le lien de naviguer
            e.preventDefault();
            
            // Cible le lien <a> même si on clique sur l'image ou le texte à l'intérieur
            const link = e.target.closest('.gallery-item');
            if (!link) return;

            const imageUrl = link.getAttribute('href');
            
            // Utilise la bibliothèque basicLightbox pour afficher l'image
            basicLightbox.create(`
                <img src="${imageUrl}" alt="">
            `).show();
        });
    }
});