document.addEventListener('DOMContentLoaded', () => {
   
    const summaryContainer = document.getElementById('submission-summary');
    if (summaryContainer) {
        const params = new URLSearchParams(window.location.search);
        const membershipLevel = params.get('membership_level');
        const levelEmojis = {
            'Gold': '🥇',
            'Silver': '🥈',
            'Bronze': '🥉',
            'NP (Non-Profit)': '🤝'
        };
        const emoji = levelEmojis[membershipLevel] || '';

        summaryContainer.innerHTML = `
            <h3>Application Summary</h3>
            <p><strong>First Name:</strong> ${params.get('firstname')}</p>
            <p><strong>Last Name:</strong> ${params.get('lastname')}</p>
            <p><strong>Email:</strong> ${params.get('email')}</p>
            <p><strong>Mobile Phone:</strong> ${params.get('phone')}</p>
            <p><strong>Business Name:</strong> ${params.get('business')}</p>
            <p><strong>Membership Level:</strong> ${membershipLevel} ${emoji}</p>
            <p><strong>Submitted on:</strong> ${new Date(params.get('form_timestamp')).toLocaleString('fr-FR')}</p>
        `;
    }


    const animationContainer = document.getElementById('celebration-animation');
    if (animationContainer) {
        const confettiPieces = ['🌸', '🌼', '🌷', '🎉', '🥳', '🎊', '🏆', '✨'];
        const numberOfPieces = 50; 

        for (let i = 0; i < numberOfPieces; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            
           
            piece.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
            
            
            piece.style.left = `${Math.random() * 100}vw`; 
            piece.style.fontSize = `${Math.random() * 1.5 + 1}rem`; 
            piece.style.animationDuration = `${Math.random() * 4 + 5}s`; 
            piece.style.animationDelay = `${Math.random() * 3}s`;

            animationContainer.appendChild(piece);
        }

        
        setTimeout(() => {
            animationContainer.style.opacity = '0';
            setTimeout(() => {
                animationContainer.remove();
            }, 1000); 
        }, 10000); 
    }
});