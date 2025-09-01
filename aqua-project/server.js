// Fichier: server.js

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // <--- LIGNE 1 (IMPORTATION)

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // <--- LIGNE 2 (UTILISATION)
app.use(bodyParser.json({ limit: '10mb' }));

// --- CONFIGURATION NODEMAILER ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- ROUTE DE L'API ---
app.post('/api/send-order-email', async (req, res) => {
    try {
        const { customerEmail, customerName, pdf, orderNumber } = req.body;
        
        console.log(`[INFO] Réception d'une nouvelle commande #${orderNumber} de ${customerName}`);

        const adminMailOptions = {
            from: `"SAP GK Groupe Commande" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `Nouvelle commande #${orderNumber} de ${customerName}`,
            html: `<p>Une nouvelle commande a été passée.</p><p><b>Client:</b> ${customerName}</p><p><b>Email:</b> ${customerEmail}</p><p><b>Numéro de commande:</b> ${orderNumber}</p>`,
            attachments: [{
                filename: `commande_${orderNumber}.pdf`,
                content: pdf.split('base64,')[1],
                encoding: 'base64'
            }]
        };
        await transporter.sendMail(adminMailOptions);
        console.log(`[SUCCESS] Email de notification envoyé à: ${process.env.ADMIN_EMAIL}`);

        const customerMailOptions = {
            from: `"SAP GK Groupe" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `Confirmation de votre commande #${orderNumber}`,
            html: `<p>Bonjour ${customerName},</p><p>Merci pour votre commande ! Nous l'avons bien reçue.</p><p>Votre numéro de commande est : <strong>${orderNumber}</strong></p><p>Nous la traitons et vous contacterons sous peu.</p><p>Cordialement,<br>L'équipe SAP GK Groupe</p>`
        };
        await transporter.sendMail(customerMailOptions);
        console.log(`[SUCCESS] Email de confirmation envoyé à: ${customerEmail}`);
        
        res.json({ success: true, message: 'Emails envoyés avec succès' });

    } catch (error) {
        console.error("[ERROR] Échec de l'envoi de l'email:", error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi des emails' });
    }
});

// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] Le serveur écoute sur le port ${PORT}`);
});