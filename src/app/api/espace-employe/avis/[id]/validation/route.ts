import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  // Vérifier que l'utilisateur est un employé
  const user = await prisma.utilisateur.findUnique({
    where: { utilisateur_id: Number(session.user.id) },
    select: { type_utilisateur: true },
  });

  if (!user || (user.type_utilisateur !== 'employe' && user.type_utilisateur !== 'admin')) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé' }), { status: 403 });
  }

  const { action } = await req.json();
  const participationId = Number(params.id);

  if (!['approuver', 'refuser'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Action invalide' }), { status: 400 });
  }

  try {
    // Récupérer la participation avec les informations nécessaires
    const participation = await prisma.participation.findUnique({
      where: { participation_id: participationId },
      include: {
        utilisateur: {
          select: {
            utilisateur_id: true,
            pseudo: true,
            email: true,
          },
        },
        covoiturage: {
          include: {
            utilisateur: {
              select: {
                utilisateur_id: true,
                pseudo: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!participation) {
      return new Response(JSON.stringify({ error: 'Participation non trouvée' }), { status: 404 });
    }

    // Mettre à jour la validation
    const validation = action === 'approuver';
    await prisma.participation.update({
      where: { participation_id: participationId },
      data: { validation },
    });

    // Si l'avis est approuvé, vérifier si tous les avis du covoiturage sont approuvés
    if (validation) {
      const allParticipations = await prisma.participation.findMany({
        where: { covoiturage_id: participation.covoiturage_id },
        include: { utilisateur: true },
      });

      const toutesValidees = allParticipations.every(p => p.validation === true);

      if (toutesValidees && participation.covoiturage.prix_personne) {
        // Créditer le chauffeur
        const nbParticipants = allParticipations.length;
        const montantTotal = participation.covoiturage.prix_personne * nbParticipants;

        await prisma.utilisateur.update({
          where: { utilisateur_id: participation.covoiturage.utilisateur_id! },
          data: { credit: { increment: montantTotal } },
        });

        // Envoyer un email de confirmation au chauffeur
        if (participation.covoiturage.utilisateur?.email) {
          await sendEmail({
            to: participation.covoiturage.utilisateur.email,
            subject: 'Tous les avis ont été approuvés',
            html: `
              <p>Bonjour ${participation.covoiturage.utilisateur.pseudo},</p>
              <p>Tous les avis de votre covoiturage ont été approuvés par notre équipe. Vos ${montantTotal} crédits ont été ajoutés à votre compte.</p>
              <p>Cordialement,<br>L'équipe EcoRide</p>
            `,
          });
        }
      }
    }

    // Envoyer un email au participant
    if (participation.utilisateur?.email) {
      await sendEmail({
        to: participation.utilisateur.email,
        subject: `Votre avis a été ${action === 'approuver' ? 'approuvé' : 'refusé'}`,
        html: `
          <p>Bonjour ${participation.utilisateur.pseudo},</p>
          <p>Votre avis concernant le covoiturage ${participation.covoiturage_id} a été ${action === 'approuver' ? 'approuvé' : 'refusé'} par notre équipe.</p>
          ${action === 'refuser' ? "<p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>" : ''}
          <p>Cordialement,<br>L'équipe EcoRide</p>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la validation de l'avis:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la validation de l'avis" }), {
      status: 500,
    });
  }
}
