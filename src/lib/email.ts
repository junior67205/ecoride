import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

type EmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailParams) {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP non configuré, email non envoyé:', { to, subject });
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ecoride.fr',
      to,
      subject,
      html,
    });
    console.log('Résultat Nodemailer:', info);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}
