import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: {
        inventory: {
          select: {
            quantity: true,
            level: true,
            item: {
              select: {
                name: true,
              },
            },
          },
        },
        quests: {
          include: {
            quest: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilizator nu a fost găsit" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Eroare la preluarea datelor:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}