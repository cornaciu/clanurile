// app/api/quests/crimes/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const crimes = await prisma.quest.findMany({
      where: {
        category: 'crime',
      },
    });
    return NextResponse.json(crimes);
  } catch (error) {
    console.error("Eroare la preluarea crimelor:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}