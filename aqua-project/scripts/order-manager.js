// scripts/order-manager.js
function saveOrderToCSV(cartItems, totalPrice, customerInfo = {}) {
    const now = new Date();
    const orderId = `CMD-${now.getTime()}`;
    const orderDate = now.toISOString();
    
    // Préparer les données pour le CSV
    const orderData = {
        orderId,
        orderDate,
        customerName: customerInfo.name || 'Non spécifié',
        customerPhone: customerInfo.phone || 'Non spécifié',
        customerEmail: customerInfo.email || 'Non spécifié',
        totalAmount: totalPrice,
        items: cartItems.map(item => `${item.quantity}x ${item.name}`).join('; ')
    };
    
    // Convertir en ligne CSV
    const csvLine = `"${orderData.orderId}","${orderData.orderDate}","${orderData.customerName}","${orderData.customerPhone}","${orderData.customerEmail}",${orderData.totalAmount},"${orderData.items}"\n`;
    
    // Récupérer les commandes existantes ou initialiser
    let orders = localStorage.getItem('sap_orders') || '';
    
    // Ajouter la nouvelle commande
    orders += csvLine;
    localStorage.setItem('sap_orders', orders);
    
    return orderId;
}

function sendOrderNotification(cartItems, totalPrice, customerInfo = {}) {
    const itemsList = cartItems.map(item => `- ${item.quantity}x ${item.name} (${item.price.toLocaleString('fr-FR')} FCFA)`).join('%0A');
    const totalFormatted = totalPrice.toLocaleString('fr-FR');
    
    // Message pour WhatsApp/Email
    const message = `Nouvelle commande SAP GK GROUPE%0A%0A`
        + `Client: ${customerInfo.name || 'Non spécifié'}%0A`
        + `Téléphone: ${customerInfo.phone || 'Non spécifié'}%0A`
        + `Email: ${customerInfo.email || 'Non spécifié'}%0A%0A`
        + `Détails de la commande:%0A`
        + `${itemsList}%0A%0A`
        + `Total: ${totalFormatted} FCFA%0A%0A`
        + `Date: ${new Date().toLocaleString('fr-FR')}`;
    
    // Ouvrir WhatsApp avec le message pré-rempli
    window.open(`https://wa.me/2282734755823?text=${message}`, '_blank');
    
    // Envoyer également par email si l'adresse est fournie
    if (customerInfo.email) {
        const emailSubject = `Nouvelle commande SAP GK GROUPE`;
        const emailBody = message.replace(/%0A/g, '\n');
        window.open(`mailto:contact@sapgkgroupe.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    }
}

function downloadOrdersCSV() {
    const orders = localStorage.getItem('sap_orders');
    if (!orders) {
        alert("Aucune commande enregistrée.");
        return;
    }
    
    // Entête CSV
    const csvHeader = "ID Commande,Date,Nom Client,Téléphone,Email,Montant Total,Articles\n";
    const csvContent = csvHeader + orders;
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `commandes-sap-gk-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

