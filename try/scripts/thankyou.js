// scripts/thankyou.js
document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('submission-summary');
    if (!summaryContainer) return;

    // Récupérer les paramètres de l'URL
    const params = new URLSearchParams(window.location.search);

    // Construire le résumé
    summaryContainer.innerHTML = `
        <h3>Application Summary</h3>
        <p><strong>First Name:</strong> ${params.get('firstname')}</p>
        <p><strong>Last Name:</strong> ${params.get('lastname')}</p>
        <p><strong>Email:</strong> ${params.get('email')}</p>
        <p><strong>Mobile Phone:</strong> ${params.get('phone')}</p>
        <p><strong>Business Name:</strong> ${params.get('business')}</p>
        <p><strong>Membership Level:</strong> ${params.get('membership_level')}</p>
        <p><strong>Submission Date:</strong> ${new Date(params.get('form_timestamp')).toLocaleString()}</p>
    `;
});