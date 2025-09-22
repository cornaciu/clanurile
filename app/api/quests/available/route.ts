// app/api/quests/available/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const token = request.cookies.get('auth_token'); // <-- Noul mod de a accesa cookie-ul

  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: token.value },
      include: {
        quests: {
          select: {
            questId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilizator inexistent" }, { status: 404 });
    }

    const userQuestIds = user.quests.map(uq => uq.questId);

    const availableQuests = await prisma.quest.findMany({
      where: {
        AND: [
          { id: { notIn: userQuestIds } },
          { minLevel: { lte: user.level } }
        ]
      }
    });

    return NextResponse.json(availableQuests, { status: 200 });
  } catch (error) {
    console.error('Eroare la preluarea misiunilor disponibile:', error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}