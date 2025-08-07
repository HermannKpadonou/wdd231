// scripts/join.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Définir la valeur de l'horodatage caché
    const timestampField = document.getElementById('formTimestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // 2. Gérer l'ouverture et la fermeture des modaux
    const openModalLinks = document.querySelectorAll('.modal-link');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');

    openModalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche le lien de naviguer
            const modalId = link.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.showModal(); // Ouvre la boîte de dialogue
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('dialog'); // Trouve la boîte de dialogue parente
            if (modal) {
                modal.close(); // Ferme la boîte de dialogue
            }
        });
    });

    // Optionnel : fermer le modal en cliquant sur le fond
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });
});