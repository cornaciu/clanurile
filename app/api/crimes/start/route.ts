// app/api/crimes/start/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const token = cookies().get('auth_token');
  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const { questId } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { username: token.value },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilizator inexistent" }, { status: 404 });
    }

    const crimeQuest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!crimeQuest || crimeQuest.category !== 'crime') {
      return NextResponse.json({ error: "Misiunea de crimă nu a fost găsită." }, { status: 404 });
    }

    // Verifici daca utilizatorul are destula sanatate
    if (user.health <= 10) { // O conditie simpla
      return NextResponse.json({ error: "Nu ai destula sanatate pentru a comite aceasta crima." }, { status: 400 });
    }

    const existingUserQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId: user.id,
          questId: questId,
        },
      },
    });

    if (existingUserQuest) {
      return NextResponse.json({ message: "Misiune deja in curs sau finalizata." }, { status: 200 });
    }

    await prisma.userQuest.create({
      data: {
        userId: user.id,
        questId: questId,
        completed: false,
      },
    });

    return NextResponse.json({ message: `Ai inceput crima: ${crimeQuest.title}` }, { status: 200 });
  } catch (error) {
    console.error("Eroare la inceperea crimei:", error);
    return NextResponse.json({ error: "Eroare interna de server" }, { status: 500 });
  }
}