import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CovoiturageResult = {
  date: string;
  nombre: bigint;
};

type CreditsResult = {
  date: string;
  credits_gagnes: number;
};

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: 'Les dates de début et de fin sont requises' },
        { status: 400 }
      );
    }

    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    // Requêtes à la base de données
    const [covoituragesResult, creditsResult, totalCredits] = await Promise.all([
      prisma.$queryRaw<CovoiturageResult[]>`
        SELECT DATE_FORMAT(date_creation, '%Y-%m-%d') as date, COUNT(*) as nombre
        FROM covoiturage 
        WHERE date_creation BETWEEN ${start} AND ${end}
        GROUP BY date ORDER BY date`,
      prisma.$queryRaw<CreditsResult[]>`
        SELECT DATE_FORMAT(c.date_creation, '%Y-%m-%d') as date, SUM(2) as credits_gagnes
        FROM participation p
        JOIN covoiturage c ON p.covoiturage_id = c.covoiturage_id
        WHERE c.date_creation BETWEEN ${start} AND ${end} AND p.validation = true
        GROUP BY date ORDER BY date`,
      prisma.utilisateur.findFirst({
        where: { type_utilisateur: 'admin' },
        select: { credit: true },
      }),
    ]);

    // Formater les données pour la semaine complète
    const covoituragesMap = new Map(
      covoituragesResult.map(item => [item.date, Number(item.nombre)])
    );
    const creditsMap = new Map(creditsResult.map(item => [item.date, Number(item.credits_gagnes)]));

    const covoituragesParJour = [];
    const creditsParJour = [];

    const loopStart = new Date(`${startDate}T00:00:00.000Z`);
    const loopEnd = new Date(`${endDate}T00:00:00.000Z`);

    for (let loop = loopStart; loop <= loopEnd; loop.setUTCDate(loop.getUTCDate() + 1)) {
      const dateStr = loop.toISOString().split('T')[0];

      covoituragesParJour.push({
        date: dateStr,
        nombre: covoituragesMap.get(dateStr) || 0,
      });

      creditsParJour.push({
        date: dateStr,
        credits_gagnes: creditsMap.get(dateStr) || 0,
      });
    }

    return NextResponse.json({
      covoituragesParJour,
      creditsParJour,
      totalCredits: totalCredits?.credit || 0,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
