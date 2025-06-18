import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const user = await prisma.utilisateur.findUnique({
    where: { utilisateur_id: Number(session.user.id) },
    select: {
      civilite: true,
      nom: true,
      prenom: true,
      email: true,
      telephone: true,
      adresse: true,
      date_naissance: true,
      pseudo: true,
      type_utilisateur: true,
      photo: true,
      credit: true,
    } satisfies Prisma.utilisateurSelect,
  });
  if (!user) {
    return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await req.json();

  // Validation des champs obligatoires
  if (
    !data.civilite ||
    !data.nom ||
    !data.prenom ||
    !data.email ||
    !data.telephone ||
    !data.adresse ||
    !data.date_naissance ||
    !data.pseudo
  ) {
    return new Response(
      JSON.stringify({ error: 'Tous les champs obligatoires doivent être remplis.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return new Response(JSON.stringify({ error: "Format d'email invalide." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validation du format téléphone (10 chiffres uniquement)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(data.telephone)) {
    return new Response(
      JSON.stringify({ error: 'Le numéro de téléphone doit contenir exactement 10 chiffres.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const updatedUser = await prisma.utilisateur.update({
      where: { utilisateur_id: Number(session.user.id) },
      data: {
        civilite: data.civilite,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        date_naissance: data.date_naissance,
        pseudo: data.pseudo,
        type_utilisateur: data.type_utilisateur || 'passager',
        photo: data.photo,
      } satisfies Prisma.utilisateurUpdateInput,
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new Response(JSON.stringify({ error: 'Cet email ou ce pseudo est déjà utilisé.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de la mise à jour du profil.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
