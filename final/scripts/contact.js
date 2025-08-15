document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        const formMessage = document.getElementById('form-message');

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const userType = document.getElementById('user-type').value;
            const organization = document.getElementById('organization').value;
            const description = document.getElementById('description').value;

            if (!firstName || !lastName || !email || !userType) {
                formMessage.textContent = 'Please fill out all required fields marked with an asterisk (*).';
                formMessage.className = 'message-error';
                return;
            }

            const newUser = { 
                firstName, lastName, email, phone, userType, 
                organization, description, date: new Date().toISOString() 
            };
            
            const users = JSON.parse(localStorage.getItem('agriTerroirUsers')) || [];
            users.push(newUser);
            localStorage.setItem('agriTerroirUsers', JSON.stringify(users));

            // MODIFICATION CLÉ : Rediriger vers la page de remerciement
            window.location.href = 'thankyou.html';
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        // ... la logique de la newsletter reste inchangée
        const newsletterMessage = document.getElementById('newsletter-message');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value;

            if (!email || !email.includes('@')) {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.className = 'message-error';
                return;
            }
            
            const subscribers = JSON.parse(localStorage.getItem('agriTerroirSubscribers')) || [];
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('agriTerroirSubscribers', JSON.stringify(subscribers));
            }
            
            newsletterMessage.textContent = 'Thank you for subscribing!';
            newsletterMessage.className = 'message-success';
            newsletterForm.reset();
        });
    }
});