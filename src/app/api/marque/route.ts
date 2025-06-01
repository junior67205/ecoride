import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const marques = await prisma.marque.findMany();
  return new Response(JSON.stringify(marques), { status: 200 });
}
