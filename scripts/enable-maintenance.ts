import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enableMaintenance() {
  try {
    console.log('🔄 Activation du mode maintenance...');

    await prisma.parametre.update({
      where: { propriete: 'mode_maintenance' },
      data: { valeur: 'true' },
    });

    console.log('✅ Mode maintenance activé avec succès !');
    console.log('🔒 Le site est maintenant accessible uniquement aux administrateurs.');
    console.log('💡 Pour désactiver : npx tsx scripts/disable-maintenance.ts');
  } catch (error) {
    console.error("❌ Erreur lors de l'activation du mode maintenance:", error);
  } finally {
    await prisma.$disconnect();
  }
}

enableMaintenance();
