// order.js - Gestion de l'envoi des commandes

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    const submitBtn = document.getElementById('submit-order-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Afficher le spinner de chargement
        btnText.textContent = 'Traitement...';
        spinner.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Récupérer les données du formulaire
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerAddress = document.getElementById('customer-address').value;
        
        // Générer un numéro de commande
        currentOrderNumber = parseInt(currentOrderNumber) + 1;
        localStorage.setItem('lastOrderNumber', currentOrderNumber);
        const orderNumber = `CMD${currentOrderNumber.toString().padStart(4, '0')}`;
        
        try {
            // Préparer les données de la commande
            const orderData = {
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                orderNumber,
                items: cart,
                total: calculateTotal(cart),
                date: new Date().toLocaleDateString('fr-FR')
            };
            
            // Générer le PDF (simplifié pour l'exemple)
            const pdfData = generateOrderPDF(orderData);
            
            // Envoyer la commande à l'API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerEmail,
                    customerName,
                    pdf: pdfData,
                    orderNumber
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Succès
                alert('Votre commande a été envoyée avec succès! Numéro de commande: ' + orderNumber);
                
                // Vider le panier
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCounter();
                
                // Fermer le modal
                document.getElementById('order-modal').style.display = 'none';
                
                // Réinitialiser le formulaire
                orderForm.reset();
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi de la commande');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue: ' + error.message);
        } finally {
            // Cacher le spinner et réactiver le bouton
            btnText.textContent = 'Confirmer et envoyer';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
});

function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function generateOrderPDF(orderData) {
    // Cette fonction simule la génération d'un PDF
    // En réalité, vous utiliseriez jsPDF pour créer un vrai PDF
    const pdfContent = `
        logotype SAP GK Groupe
        
        RÉCAPITULATIF DE LA COMMANDE
    
        COMMANDE ${orderData.orderNumber}
        Date: ${orderData.date}
        Client: ${orderData.customerName}
        Email: ${orderData.customerEmail}
        Téléphone: ${orderData.customerPhone}
        Adresse: ${orderData.customerAddress}
        
        DÉTAILS DE LA COMMANDE:
        ${orderData.items.map(item => `
          - ${item.name} x${item.quantity}: ${item.price * item.quantity} FCFA
        `).join('')}
        
        TOTAL: ${orderData.total} FCFA
    `;
    
    // Pour un vrai PDF, utilisez:
    // const doc = new jsPDF();
    // doc.text(pdfContent, 10, 10);
    // return doc.output('datauristring');
    
    // Pour l'exemple, on retourne un string base64 simulé
    return 'data:application/pdf;base64,' + btoa(pdfContent);
}