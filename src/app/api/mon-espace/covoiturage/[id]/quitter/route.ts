import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  const covoiturageId = Number(params.id);
  const userId = Number(session.user.id);

  try {
    // Vérifier la participation
    const participation = await prisma.participation.findUnique({
      where: {
        utilisateur_id_covoiturage_id: {
          utilisateur_id: userId,
          covoiturage_id: covoiturageId,
        },
      },
      include: {
        covoiturage: true,
      },
    });

    if (!participation) {
      return new Response(JSON.stringify({ error: 'Vous ne participez pas à ce covoiturage.' }), {
        status: 400,
      });
    }

    // Vérifier que l'utilisateur n'est pas le chauffeur
    if (participation.covoiturage.utilisateur_id === userId) {
      return new Response(
        JSON.stringify({ error: 'Le chauffeur ne peut pas quitter son propre covoiturage.' }),
        { status: 400 }
      );
    }

    // Vérifier que le covoiturage est ouvert
    if (participation.covoiturage.statut !== 'ouvert') {
      return new Response(
        JSON.stringify({ error: 'Impossible de quitter un covoiturage non ouvert.' }),
        { status: 400 }
      );
    }

    // Vérifier que la date de départ n'est pas passée
    if (
      participation.covoiturage.date_depart &&
      new Date(participation.covoiturage.date_depart) < new Date()
    ) {
      return new Response(
        JSON.stringify({ error: 'Impossible de quitter un covoiturage déjà passé.' }),
        { status: 400 }
      );
    }

    // Vérifier que le montant de remboursement est strictement positif
    if (!participation.covoiturage.prix_personne || participation.covoiturage.prix_personne <= 0) {
      return new Response(JSON.stringify({ error: 'Montant de remboursement invalide.' }), {
        status: 400,
      });
    }

    // Remboursement et suppression dans une transaction
    await prisma.$transaction([
      // Supprimer la participation
      prisma.participation.delete({
        where: {
          utilisateur_id_covoiturage_id: {
            utilisateur_id: userId,
            covoiturage_id: covoiturageId,
          },
        },
      }),
      // Rembourser le passager
      prisma.utilisateur.update({
        where: { utilisateur_id: userId },
        data: {
          credit: { increment: participation.covoiturage.prix_personne ?? 0 },
        },
      }),
      // Incrémenter le nombre de places
      prisma.covoiturage.update({
        where: { covoiturage_id: covoiturageId },
        data: {
          nb_place: { increment: 1 },
        },
      }),
    ]);

    return new Response(
      JSON.stringify({ message: 'Vous avez quitté le covoiturage et été remboursé.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur quitter covoiturage:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la sortie du covoiturage.' }), {
      status: 500,
    });
  }
}
