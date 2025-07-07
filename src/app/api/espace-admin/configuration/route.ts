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
    const parametres = await prisma.parametre.findMany();
    return NextResponse.json(parametres, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const body: { [key: string]: string } = await req.json();

    const updatePromises = Object.entries(body).map(([propriete, valeur]) =>
      prisma.parametre.update({
        where: { propriete },
        data: { valeur: String(valeur) },
      })
    );

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ message: 'Configuration mise à jour avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
