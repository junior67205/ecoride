import 'dotenv/config';
import { sendEmail } from '../src/lib/email';

async function main() {
  try {
    await sendEmail({
      to: 'test@ecoride.fr', // tu peux mettre n'importe quel email, il arrivera dans Mailtrap
      subject: 'Test Mailtrap EcoRide',
      html: '<h1>Test Mailtrap</h1><p>Si tu vois ce message dans Mailtrap, tout fonctionne !</p>',
    });
    console.log('Email envoyé avec succès !');
  } catch (err) {
    console.error('Erreur lors de l’envoi de l’email :', err);
  }
}

main();
