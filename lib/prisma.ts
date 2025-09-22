import { PrismaClient } from '@prisma/client';

// Declarăm o variabilă globală pentru a stoca clientul Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Folosim o instanță existentă dacă există deja una, altfel creăm una nouă
export const prisma = global.prisma || new PrismaClient();

// În mediu de dezvoltare, stocăm instanța pe variabila globală
// Aceasta previne crearea constantă de noi instanțe la hot-reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}