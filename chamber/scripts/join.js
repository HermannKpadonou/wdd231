
document.addEventListener('DOMContentLoaded', () => {
   
    const timestampField = document.getElementById('formTimestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

   
    const openModalLinks = document.querySelectorAll('.modal-link');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');

    openModalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const modalId = link.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('dialog'); 
            if (modal) {
                modal.close();
            }
        });
    });
});