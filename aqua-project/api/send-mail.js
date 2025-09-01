// Fichier : /api/send-email.js (Version finale et robuste)

const nodemailer = require('nodemailer');
const { send } = require('micro');
const cors = require('micro-cors')(); // On importe et initialise le middleware CORS

// On encapsule notre logique dans le middleware CORS
const handler = async (req, res) => {
  // On vérifie la méthode après la gestion du "preflight" par CORS
  if (req.method !== 'POST') {
    return send(res, 405, { success: false, message: 'Seule la méthode POST est autorisée' });
  }

  try {
    const { customerEmail, customerName, pdf, orderNumber } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminMailOptions = {
      from: `"Nouvelle Commande" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle commande #${orderNumber} de ${customerName}`,
      html: `<p>Nouvelle commande de <b>${customerName}</b> (${customerEmail}).</p><p>Numéro: <b>${orderNumber}</b>.</p><p>PDF en pièce jointe.</p>`,
      attachments: [{
        filename: `commande_${orderNumber}.pdf`,
        content: pdf.split('base64,')[1],
        encoding: 'base64',
      }],
    };
    await transporter.sendMail(adminMailOptions);

    const customerMailOptions = {
      from: `"SAP GK Groupe" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Confirmation de votre commande #${orderNumber}`,
      html: `<p>Bonjour ${customerName},</p><p>Merci pour votre commande ! Votre numéro de confirmation est : <strong>${orderNumber}</strong>.</p><p>Cordialement,<br>L'équipe SAP GK Groupe</p>`,
    };
    await transporter.sendMail(customerMailOptions);

    return send(res, 200, { success: true, message: 'Emails envoyés avec succès' });

  } catch (error) {
    console.error('ERREUR API:', error);
    return send(res, 500, { success: false, message: 'Une erreur interne est survenue.' });
  }
};

// On exporte notre handler encapsulé par le middleware CORS
module.exports = cors(handler);