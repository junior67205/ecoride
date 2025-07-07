import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const param = await prisma.parametre.findUnique({
      where: { propriete: 'afficher_galerie_homepage' },
    });
    return NextResponse.json({ afficher: param?.valeur === 'true' });
  } catch (error) {
    console.error('Erreur lors de la récupération du paramètre galerie:', error);
    return NextResponse.json({ afficher: false }, { status: 500 });
  }
}
