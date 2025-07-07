import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const keepParams = ['mode_maintenance', 'afficher_galerie_homepage'];

async function main() {
  console.log('🧹 Suppression des paramètres non essentiels...');
  await prisma.parametre.deleteMany({
    where: {
      propriete: {
        notIn: keepParams,
      },
    },
  });
  await prisma.$disconnect();
  console.log('✅ Nettoyage terminé. Seuls les paramètres essentiels sont conservés.');
}

main().catch(e => {
  console.error('❌ Erreur lors du nettoyage:', e);
  prisma.$disconnect();
  process.exit(1);
});
