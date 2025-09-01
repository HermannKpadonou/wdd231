// scripts/pdf-generator.js
function generateOrderPDF(cartItems, totalPrice) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6'
    });

    // Logo et en-tête
    doc.addImage('images/logo_simple.png', 'PNG', 15, 10, 20, 20);
    doc.setFontSize(16);
    doc.setTextColor(10, 24, 65);
    doc.text('SAP GK GROUPE', 40, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Innovation Aquacole & Développement Durable', 40, 26);
    doc.text('27 34 75 58 23 / 05 05 25 32 09', 40, 32);
    doc.text('contact@sapgkgroupe.com', 40, 38);

    // Ligne séparatrice
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 45, 105, 45);

    // Titre du document
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('RÉCAPITULATIF DE COMMANDE', 55, 55, { align: 'center' });

    // Détails de la commande
    let yPosition = 65;
    doc.setFontSize(10);
    
    cartItems.forEach(item => {
        if (yPosition > 130) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.text(`${item.quantity}x ${item.name}`, 20, yPosition);
        doc.setTextColor(44, 164, 212);
        doc.text(`${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA`, 90, yPosition, { align: 'right' });
        yPosition += 7;
    });

    // Ligne séparatrice avant le total
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPosition + 5, 105, yPosition + 5);

    // Total
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL:', 20, yPosition + 15);
    doc.setTextColor(44, 164, 212);
    doc.text(`${totalPrice.toLocaleString('fr-FR')} FCFA`, 90, yPosition + 15, { align: 'right' });

    // Date
    const now = new Date();
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR')}`, 15, 140);

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Merci pour votre confiance!', 55, 148, { align: 'center' });

    // Sauvegarder le PDF
    doc.save(`commande-sap-gk-${now.getTime()}.pdf`);
}