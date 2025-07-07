import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function disableMaintenance() {
  try {
    console.log('🔄 Désactivation du mode maintenance...');

    await prisma.parametre.update({
      where: { propriete: 'mode_maintenance' },
      data: { valeur: 'false' },
    });

    console.log('✅ Mode maintenance désactivé avec succès !');
    console.log('🌐 Le site est maintenant accessible à tous les utilisateurs.');
  } catch (error) {
    console.error('❌ Erreur lors de la désactivation du mode maintenance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

disableMaintenance();
