import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  PrismaClient,
  covoiturage,
  participation,
  utilisateur,
  voiture,
  marque,
} from '@prisma/client';

const prisma = new PrismaClient();

type CovoiturageWithRelations = covoiturage & {
  voiture: (voiture & { marque: marque | null }) | null;
  utilisateur: Pick<utilisateur, 'utilisateur_id' | 'pseudo' | 'photo' | 'email'> | null;
  participation: (participation & {
    utilisateur: Pick<utilisateur, 'utilisateur_id' | 'pseudo' | 'photo' | 'email'>;
  })[];
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  try {
    // Récupérer l'utilisateur pour connaître son type
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { utilisateur_id: Number(session.user.id) },
      select: { type_utilisateur: true },
    });

    if (!utilisateur) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });
    }

    // Récupérer les covoiturages selon le type d'utilisateur
    let covoiturages: CovoiturageWithRelations[] = [];

    if (utilisateur.type_utilisateur === 'chauffeur') {
      covoiturages = await prisma.covoiturage.findMany({
        where: { utilisateur_id: Number(session.user.id) },
        include: {
          voiture: {
            include: { marque: true },
          },
          utilisateur: {
            select: {
              utilisateur_id: true,
              pseudo: true,
              photo: true,
              email: true,
            },
          },
          participation: {
            include: {
              utilisateur: {
                select: {
                  utilisateur_id: true,
                  pseudo: true,
                  photo: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { date_depart: 'desc' },
      });
    } else if (utilisateur.type_utilisateur === 'passager') {
      covoiturages = await prisma.covoiturage.findMany({
        where: {
          participation: {
            some: { utilisateur_id: Number(session.user.id) },
          },
        },
        include: {
          voiture: {
            include: { marque: true },
          },
          utilisateur: {
            select: {
              utilisateur_id: true,
              pseudo: true,
              photo: true,
              email: true,
            },
          },
          participation: {
            include: {
              utilisateur: {
                select: {
                  utilisateur_id: true,
                  pseudo: true,
                  photo: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { date_depart: 'desc' },
      });
    } else {
      // Si l'utilisateur est les deux, on combine les deux requêtes
      const covoituragesChauffeur = await prisma.covoiturage.findMany({
        where: { utilisateur_id: Number(session.user.id) },
        include: {
          voiture: {
            include: { marque: true },
          },
          utilisateur: {
            select: {
              utilisateur_id: true,
              pseudo: true,
              photo: true,
              email: true,
            },
          },
          participation: {
            include: {
              utilisateur: {
                select: {
                  utilisateur_id: true,
                  pseudo: true,
                  photo: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      const covoituragesPassager = await prisma.covoiturage.findMany({
        where: {
          participation: {
            some: { utilisateur_id: Number(session.user.id) },
          },
        },
        include: {
          voiture: {
            include: { marque: true },
          },
          utilisateur: {
            select: {
              utilisateur_id: true,
              pseudo: true,
              photo: true,
              email: true,
            },
          },
          participation: {
            include: {
              utilisateur: {
                select: {
                  utilisateur_id: true,
                  pseudo: true,
                  photo: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // Combiner et dédoublonner les résultats
      const covoituragesMap = new Map();
      [...covoituragesChauffeur, ...covoituragesPassager].forEach(covoiturage => {
        covoituragesMap.set(covoiturage.covoiturage_id, covoiturage);
      });
      covoiturages = Array.from(covoituragesMap.values()).sort(
        (a, b) => new Date(b.date_depart).getTime() - new Date(a.date_depart).getTime()
      );
    }

    // Transformer les données pour l'affichage
    const historique = covoiturages.map(covoiturage => ({
      id: covoiturage.covoiturage_id,
      lieu_depart: covoiturage.lieu_depart,
      lieu_arrivee: covoiturage.lieu_arrivee,
      date_depart: covoiturage.date_depart,
      heure_depart: covoiturage.heure_depart,
      date_arrivee: covoiturage.date_arrivee,
      heure_arrivee: covoiturage.heure_arrivee,
      prix_personne: covoiturage.prix_personne,
      nb_place: covoiturage.nb_place,
      statut: covoiturage.statut,
      role: covoiturage.utilisateur_id === Number(session.user.id) ? 'chauffeur' : 'passager',
      voiture: covoiturage.voiture
        ? {
            modele: covoiturage.voiture.modele,
            marque: covoiturage.voiture.marque?.libelle,
            immatriculation: covoiturage.voiture.immatriculation,
          }
        : null,
      chauffeur: covoiturage.utilisateur
        ? {
            id: covoiturage.utilisateur.utilisateur_id,
            pseudo: covoiturage.utilisateur.pseudo,
            photo: covoiturage.utilisateur.photo
              ? `/uploads/${covoiturage.utilisateur.photo}`
              : null,
            email: covoiturage.utilisateur.email,
          }
        : null,
      participants: covoiturage.participation.map(p => ({
        id: p.utilisateur.utilisateur_id,
        pseudo: p.utilisateur.pseudo,
        photo: p.utilisateur.photo ? `/uploads/${p.utilisateur.photo}` : null,
        email: p.utilisateur.email,
        date_participation: p.date_participation,
      })),
    }));

    return new Response(JSON.stringify({ historique }), { status: 200 });
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération de l'historique" }),
      {
        status: 500,
      }
    );
  }
}
