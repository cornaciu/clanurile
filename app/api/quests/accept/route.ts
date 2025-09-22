import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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

    const existingUserQuest = await prisma.userQuest.findFirst({
      where: {
        userId: user.id,
        questId: questId,
      },
    });

    if (existingUserQuest) {
      return NextResponse.json({ error: "Misiune deja acceptată" }, { status: 400 });
    }
    
    // <<-- Adaugă data de start la crearea misiunii
    const newUserQuest = await prisma.userQuest.create({
      data: {
        userId: user.id,
        questId: questId,
        startedAt: new Date(),
      },
    });

    return NextResponse.json(newUserQuest, { status: 200 });
  } catch (error) {
    console.error("Eroare la acceptarea misiunii:", error);
    return NextResponse.json({ error: "Eroare internă a serverului" }, { status: 500 });
  }
}