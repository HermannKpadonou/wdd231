// Fichier : /api/send-email.js (Version CommonJS ultra-standard)

const nodemailer = require('nodemailer');

// On exporte la fonction handler
module.exports = async (req, res) => {
  // --- Gestion Manuelle du CORS (la plus explicite possible) ---
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si c'est une requête OPTIONS (preflight), on répond immédiatement OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // On s'assure que c'est bien une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }

  try {
    const { customerEmail, customerName, pdf, orderNumber } = req.body;

    // On vérifie que les données essentielles sont présentes
    if (!customerEmail || !customerName || !pdf || !orderNumber) {
      return res.status(400).json({ message: 'Données manquantes dans la requête.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email pour l'admin
    await transporter.sendMail({
      from: `"Nouvelle Commande" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle commande #${orderNumber} de ${customerName}`,
      html: `<p>Commande de <b>${customerName}</b> (${customerEmail}). PDF en pièce jointe.</p>`,
      attachments: [{
        filename: `commande_${orderNumber}.pdf`,
        content: pdf.split('base64,')[1],
        encoding: 'base64',
      }],
    });

    // Email pour le client
    await transporter.sendMail({
      from: `"SAP GK Groupe" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Confirmation de votre commande #${orderNumber}`,
      html: `<p>Bonjour ${customerName},</p><p>Merci pour votre commande ! Votre numéro de confirmation est : <strong>${orderNumber}</strong>.</p>`,
    });

    return res.status(200).json({ success: true, message: 'Emails envoyés.' });

  } catch (error) {
    // Log de l'erreur côté serveur pour le débogage sur Vercel
    console.error('--- ERREUR CRITIQUE DANS LA FONCTION API ---');
    console.error(error);
    console.error('-------------------------------------------');
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
};