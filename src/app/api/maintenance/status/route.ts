import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const maintenanceParam = await prisma.parametre.findUnique({
      where: { propriete: 'mode_maintenance' },
    });

    const maintenanceMode = maintenanceParam?.valeur === 'true';

    return NextResponse.json({ maintenanceMode }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du statut de maintenance:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}
