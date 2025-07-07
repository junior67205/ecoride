import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const images = await prisma.galerie_image.findMany({
      where: { actif: true },
      orderBy: { ordre: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Erreur lors de la récupération des images publiques:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
