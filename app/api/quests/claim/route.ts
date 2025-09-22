// app/api/quests/claim/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const token = cookies().get('auth_token');
  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const { userQuestId } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { username: token.value },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilizator inexistent" }, { status: 404 });
    }

    const userQuest = await prisma.userQuest.findUnique({
      where: {
        id: userQuestId,
        userId: user.id,
      },
      include: {
        quest: true,
      },
    });

    if (!userQuest) {
      return NextResponse.json({ error: "Misiune inexistentă sau nu-ți aparține." }, { status: 404 });
    }
    
    // Verifică dacă misiunea a fost deja revendicată
    if (userQuest.claimed) {
      return NextResponse.json({ error: "Misiunea a fost deja revendicată." }, { status: 400 });
    }

    // Aici este logica crucială de validare a timpului pe server
    const startedAtTime = userQuest.startedAt?.getTime();
    if (!startedAtTime || !userQuest.quest.time) {
        return NextResponse.json({ error: "Misiunea nu are o dată de început sau o durată validă." }, { status: 400 });
    }
    
    const endTime = startedAtTime + userQuest.quest.time * 60 * 1000;
    const now = Date.now();
    
    if (now < endTime) {
      return NextResponse.json({ error: "Misiunea nu este încă finalizată." }, { status: 400 });
    }

    // Actualizează statisticiile utilizatorului
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        money: {
          increment: userQuest.quest.rewardMoney,
        },
        experience: {
          increment: userQuest.quest.rewardExp,
        },
      },
    });
    
    // Marchează misiunea ca fiind finalizată și revendicată
    await prisma.userQuest.update({
      where: { id: userQuest.id },
      data: { 
        completed: true, 
        claimed: true, 
      },
    });
    
    return NextResponse.json({
        message: "Premiul a fost revendicat cu succes!",
        user: updatedUser,
    }, { status: 200 });

  } catch (error) {
    console.error('Eroare la revendicarea premiului:', error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}