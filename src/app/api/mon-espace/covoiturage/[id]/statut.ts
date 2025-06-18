import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }
  const { statut } = await req.json();
  const { id } = params;

  // Vérifier que l'utilisateur est bien le chauffeur
  const covoiturage = await prisma.covoiturage.findUnique({
    where: { covoiturage_id: Number(id) },
  });
  if (!covoiturage) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  if (covoiturage.utilisateur_id !== Number(session.user.id)) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 403 });
  }

  // Vérification stricte des transitions de statut
  if (statut === 'en cours' && covoiturage.statut !== 'ouvert') {
    return new Response(
      JSON.stringify({ error: 'Impossible de démarrer un covoiturage non ouvert.' }),
      { status: 400 }
    );
  }
  if (statut === 'termine' && covoiturage.statut !== 'en cours') {
    return new Response(
      JSON.stringify({ error: "Impossible de terminer un covoiturage qui n'est pas en cours." }),
      { status: 400 }
    );
  }

  await prisma.covoiturage.update({
    where: { covoiturage_id: Number(id) },
    data: { statut },
  });

  // Si le covoiturage passe au statut 'termine', envoyer les emails aux participants
  if (statut === 'termine') {
    // Récupérer les participations avec tous les champs nécessaires
    const participations = await prisma.participation.findMany({
      where: { covoiturage_id: Number(id) },
      include: {
        utilisateur: true,
      },
    });

    // Envoyer les mails aux participants
    for (const participation of participations) {
      if (participation.utilisateur?.email) {
        await sendEmail({
          to: participation.utilisateur.email,
          subject: 'Merci de valider votre trajet',
          html: `
            <p>Bonjour ${participation.utilisateur.pseudo},</p>
            <p>Votre covoiturage est arrivé à destination. Merci de vous rendre sur votre espace EcoRide pour valider que tout s'est bien passé.</p>
            <p>Cette validation est importante pour que le chauffeur puisse recevoir ses crédits.</p>
            <p>Cordialement,<br>L'équipe EcoRide</p>
          `,
        });
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
