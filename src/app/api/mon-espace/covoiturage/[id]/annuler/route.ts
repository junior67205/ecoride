import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  try {
    // Vérifier que le covoiturage existe et que l'utilisateur est le chauffeur
    const covoiturage = await prisma.covoiturage.findUnique({
      where: { covoiturage_id: Number(params.id) },
      include: {
        participation: {
          include: {
            utilisateur: {
              select: {
                utilisateur_id: true,
                email: true,
                pseudo: true,
                credit: true,
              },
            },
          },
        },
        utilisateur: {
          select: {
            utilisateur_id: true,
            email: true,
            pseudo: true,
            credit: true,
          },
        },
      },
    });

    if (!covoiturage) {
      return new Response(JSON.stringify({ error: 'Covoiturage non trouvé' }), { status: 404 });
    }

    if (!covoiturage.utilisateur) {
      return new Response(JSON.stringify({ error: 'Chauffeur non trouvé' }), { status: 404 });
    }

    if (covoiturage.utilisateur_id !== Number(session.user.id)) {
      return new Response(
        JSON.stringify({ error: "Vous n'êtes pas le chauffeur de ce covoiturage" }),
        { status: 403 }
      );
    }

    if (covoiturage.statut === 'annule') {
      return new Response(JSON.stringify({ error: 'Ce covoiturage est déjà annulé' }), {
        status: 400,
      });
    }

    if (
      !covoiturage.prix_personne ||
      !covoiturage.date_depart ||
      !covoiturage.lieu_depart ||
      !covoiturage.lieu_arrivee
    ) {
      return new Response(JSON.stringify({ error: 'Données du covoiturage incomplètes' }), {
        status: 400,
      });
    }

    // Démarrer une transaction pour garantir l'intégrité des données
    await prisma.$transaction(async tx => {
      // 1. Mettre à jour le statut du covoiturage
      await tx.covoiturage.update({
        where: { covoiturage_id: Number(params.id) },
        data: { statut: 'annule' },
      });

      // 2. Rembourser les participants
      for (const participation of covoiturage.participation) {
        if (!participation.utilisateur?.email || !participation.utilisateur?.pseudo) continue;

        // Formatage date/heure et villes (null safety)
        const date = covoiturage.date_depart ? new Date(covoiturage.date_depart) : new Date();
        const heure = covoiturage.heure_depart ? covoiturage.heure_depart.slice(0, 5) : '';
        const dateFr = date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const lieuDepart = covoiturage.lieu_depart
          ? covoiturage.lieu_depart.charAt(0).toUpperCase() + covoiturage.lieu_depart.slice(1)
          : '';
        const lieuArrivee = covoiturage.lieu_arrivee
          ? covoiturage.lieu_arrivee.charAt(0).toUpperCase() + covoiturage.lieu_arrivee.slice(1)
          : '';

        // Rembourser le participant
        await tx.utilisateur.update({
          where: { utilisateur_id: participation.utilisateur.utilisateur_id },
          data: {
            credit: {
              increment: covoiturage.prix_personne ?? 0,
            },
          },
        });

        // Envoyer un email au participant
        await sendEmail({
          to: participation.utilisateur.email,
          subject: 'Annulation de votre covoiturage',
          html: `
            <p>Bonjour ${participation.utilisateur.pseudo},</p>
            <p>Le covoiturage du <b>${dateFr} à ${heure}</b> de <b>${lieuDepart}</b> à <b>${lieuArrivee}</b> a été annulé par le chauffeur.</p>
            <p>Vos ${covoiturage.prix_personne ?? 0} crédits ont été remboursés sur votre compte.</p>
            <p>Cordialement,<br>L'équipe EcoRide</p>
          `,
        });
      }

      // 3. Débiter le chauffeur (il rend ce qu'il a reçu)
      const placesUtilisees = covoiturage.participation.length;
      const debitChauffeur = new Prisma.Decimal(
        (Number(covoiturage.prix_personne ?? 0) - 2) * placesUtilisees
      );

      await tx.utilisateur.update({
        where: { utilisateur_id: covoiturage.utilisateur_id ?? 0 },
        data: {
          credit: {
            decrement: debitChauffeur,
          },
        },
      });

      // 4. Débiter la plateforme (admin)
      const admin = await tx.utilisateur.findFirst({
        where: { type_utilisateur: 'admin' },
        select: { utilisateur_id: true },
      });
      if (admin) {
        await tx.utilisateur.update({
          where: { utilisateur_id: admin.utilisateur_id },
          data: {
            credit: {
              decrement: 2 * placesUtilisees,
            },
          },
        });
      }
    });

    return new Response(JSON.stringify({ message: 'Covoiturage annulé avec succès' }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de l'annulation du covoiturage:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'annulation du covoiturage" }), {
      status: 500,
    });
  }
}
