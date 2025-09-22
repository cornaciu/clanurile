import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const token = cookies().get('auth_token');
  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const { itemId, quantity } = await request.json();

  if (!itemId || !quantity || quantity <= 0) {
    return NextResponse.json({ error: "Date invalide. Te rog specifică un itemId și o cantitate validă." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: token.value },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilizator inexistent" }, { status: 404 });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Obiectul nu a fost găsit în baza de date." }, { status: 404 });
    }

    // Folosim upsert pentru a actualiza sau a crea înregistrarea
    const userItem = await prisma.userItem.upsert({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: itemId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: user.id,
        itemId: itemId,
        quantity: quantity,
      },
      include: {
        item: true,
      },
    });

    return NextResponse.json({
      message: `Ai adăugat ${quantity} x ${userItem.item.name} în inventar.`,
      userItem: userItem,
    }, { status: 200 });

  } catch (error) {
    console.error("Eroare la adăugarea obiectului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}