import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const user = await prisma.utilisateur.findUnique({
      where: { utilisateur_id: Number(session.user.id) },
      select: {
        utilisateur_id: true,
        nom: true,
        prenom: true,
        email: true,
        pseudo: true,
        telephone: true,
        adresse: true,
        civilite: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur GET /api/mon-espace/profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Valider que les données ne sont pas vides
    if (!data.nom || !data.prenom) {
      return NextResponse.json({ message: 'Le nom et le prénom sont requis' }, { status: 400 });
    }

    const updatedUser = await prisma.utilisateur.update({
      where: { utilisateur_id: Number(session.user.id) },
      data: {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        adresse: data.adresse,
        civilite: data.civilite,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erreur PATCH /api/mon-espace/profil:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: 'Erreur de mise à jour' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
