import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { itemId } = await request.json();
  const token = cookies().get('auth_token');

  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username: token.value } });
    const userItem = await prisma.userItem.findFirst({
      where: { userId: user.id, itemId: itemId },
      include: { item: true }
    });

    if (!userItem || userItem.quantity <= 0) {
      return NextResponse.json({ error: "Obiect inexistent sau epuizat" }, { status: 404 });
    }

    // Logică pentru a folosi obiectul
    if (userItem.item.name === "Potiune de viata") {
        const healthIncrease = 20; // Exemplu
        await prisma.user.update({
          where: { id: user.id },
          data: { health: { increment: healthIncrease } },
        });
        await prisma.userItem.update({
            where: { userId_itemId: { userId: user.id, itemId: itemId } },
            data: { quantity: { decrement: 1 } },
        });
        return NextResponse.json({ message: `Ai folosit o poțiune de viață. Sănătate +${healthIncrease}` });
    }

    return NextResponse.json({ error: "Tip de obiect necunoscut." }, { status: 400 });

  } catch (error) {
    console.error("Eroare la utilizarea obiectului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}