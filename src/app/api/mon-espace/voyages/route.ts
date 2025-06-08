import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  const {
    depart,
    arrivee,
    dateDepart,
    heureDepart,
    dateArrivee,
    heureArrivee,
    prix,
    vehiculeId,
    nb_place,
  } = await req.json();

  // Vérifier que tous les champs requis sont présents
  if (
    !depart ||
    !arrivee ||
    !dateDepart ||
    !heureDepart ||
    !dateArrivee ||
    !heureArrivee ||
    !prix ||
    !vehiculeId
  ) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont obligatoires' }), {
      status: 400,
    });
  }

  // Vérifier que le prix est supérieur à 2 crédits
  if (Number(prix) <= 2) {
    return new Response(JSON.stringify({ error: 'Le prix doit être supérieur à 2 crédits' }), {
      status: 400,
    });
  }

  // Récupérer la voiture
  const voiture = await prisma.voiture.findUnique({
    where: { voiture_id: Number(vehiculeId) },
  });

  if (!voiture) {
    return new Response(JSON.stringify({ error: 'Véhicule non trouvé' }), { status: 404 });
  }

  // Calculer le nombre de places disponibles par défaut (capacité du véhicule moins le conducteur)
  const nbPlacesParDefaut = Math.max(0, (voiture.nb_place || 0) - 1);

  // Si le nombre de places est spécifié, vérifier qu'il est valide
  if (nb_place) {
    if (Number(nb_place) <= 0) {
      return new Response(
        JSON.stringify({ error: 'Le nombre de places doit être supérieur à 0' }),
        {
          status: 400,
        }
      );
    }
    // Vérifier que le nombre de places ne dépasse pas la capacité totale du véhicule
    if (Number(nb_place) > (voiture.nb_place || 0)) {
      return new Response(
        JSON.stringify({
          error: `Le nombre de places ne peut pas dépasser ${voiture.nb_place} (capacité totale du véhicule)`,
        }),
        { status: 400 }
      );
    }
  }

  // Créer le covoiturage
  try {
    const covoiturage = await prisma.covoiturage.create({
      data: {
        lieu_depart: depart,
        lieu_arrivee: arrivee,
        prix_personne: Number(prix),
        nb_place: nb_place ? Number(nb_place) : nbPlacesParDefaut,
        voiture: { connect: { voiture_id: voiture.voiture_id } },
        utilisateur: { connect: { utilisateur_id: Number(session.user.id) } },
        statut: 'ouvert',
        date_depart: dateDepart ? new Date(dateDepart) : undefined,
        heure_depart: heureDepart || undefined,
        date_arrivee: dateArrivee ? new Date(dateArrivee) : undefined,
        heure_arrivee: heureArrivee || undefined,
      },
    });
    return new Response(JSON.stringify({ message: 'Voyage créé', covoiturage }), { status: 201 });
  } catch (error) {
    console.error('Erreur création voyage:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la création du voyage.' }), {
      status: 500,
    });
  }
}
