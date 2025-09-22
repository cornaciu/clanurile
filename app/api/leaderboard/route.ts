import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: [
        { level: 'desc' },
        { experience: 'desc' },
      ],
      take: 10, // Poți alege câți utilizatori vrei să afișezi
      select: {
        username: true,
        level: true,
        money: true,
        wins: true,
        losses: true,
      },
    });

    // Adaugă un câmp de 'rank' dinamic pe baza ordinii
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json(rankedLeaderboard);
  } catch (error) {
    console.error("Eroare la preluarea clasamentului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}