import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Désactiver le mode maintenance
    await prisma.parametre.update({
      where: { propriete: 'mode_maintenance' },
      data: { valeur: 'false' },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Mode maintenance désactivé avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la désactivation du mode maintenance:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la désactivation du mode maintenance',
      },
      { status: 500 }
    );
  }
}
