// Fichier : /api/send-email.js

// On importe les dépendances nécessaires
const nodemailer = require('nodemailer');

// On définit la fonction principale que Vercel exécutera
export default async function handler(req, res) {
  // On autorise les requêtes provenant de n'importe quelle origine (CORS)
  // C'est crucial pour que votre site web puisse communiquer avec cette API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Vercel envoie une requête "preflight" avec la méthode OPTIONS pour vérifier les permissions CORS.
  // On doit y répondre positivement.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // On s'assure que la méthode de la requête est bien POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Seule la méthode POST est autorisée' });
  }

  try {
    // On récupère les données envoyées depuis boutique.js
    const { customerEmail, customerName, pdf, orderNumber } = req.body;

    // --- CONFIGURATION DE NODEMAILER ---
    // On utilise les variables d'environnement configurées sur Vercel
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- EMAIL POUR L'ADMINISTRATEUR ---
    const adminMailOptions = {
      from: `"Nouvelle Commande" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle commande #${orderNumber} de ${customerName}`,
      html: `<p>Une nouvelle commande a été passée.</p><p><b>Client:</b> ${customerName}</p><p><b>Email:</b> ${customerEmail}</p><p><b>Numéro de commande:</b> ${orderNumber}</p><p>Le récapitulatif PDF est en pièce jointe.</p>`,
      attachments: [{
        filename: `commande_${orderNumber}.pdf`,
        content: pdf.split('base64,')[1],
        encoding: 'base64',
      }],
    };
    await transporter.sendMail(adminMailOptions);

    // --- EMAIL DE CONFIRMATION POUR LE CLIENT ---
    const customerMailOptions = {
      from: `"SAP GK Groupe" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Confirmation de votre commande #${orderNumber}`,
      html: `<p>Bonjour ${customerName},</p><p>Merci pour votre commande ! Nous l'avons bien reçue.</p><p>Votre numéro de commande est : <strong>${orderNumber}</strong></p><p>Nous la traitons et vous contacterons sous peu pour la livraison.</p><p>Cordialement,<br>L'équipe SAP GK Groupe</p>`,
    };
    await transporter.sendMail(customerMailOptions);

    // On renvoie une réponse de succès
    return res.status(200).json({ success: true, message: 'Emails envoyés avec succès' });

  } catch (error) {
    // En cas d'erreur, on loggue les détails sur Vercel pour le débogage
    console.error('ERREUR API:', error);
    // On renvoie une réponse d'erreur
    return res.status(500).json({ success: false, message: 'Une erreur interne est survenue.' });
  }
}