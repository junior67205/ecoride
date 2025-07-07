import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      where: {
        type_utilisateur: 'utilisateur',
      },
      select: {
        utilisateur_id: true,
        nom: true,
        prenom: true,
        email: true,
        pseudo: true,
        type_utilisateur: true,
        credit: true,
        suspendu: true,
      },
      orderBy: {
        utilisateur_id: 'desc',
      },
    });

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const { utilisateur_id, suspendu } = await req.json();

    if (utilisateur_id === undefined || suspendu === undefined) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { utilisateur_id: parseInt(utilisateur_id) },
      data: { suspendu: suspendu },
      select: {
        utilisateur_id: true,
        nom: true,
        prenom: true,
        email: true,
        pseudo: true,
        type_utilisateur: true,
        credit: true,
        suspendu: true,
      },
    });

    return NextResponse.json(utilisateur, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suspension/réactivation du compte:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
