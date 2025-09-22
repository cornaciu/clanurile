import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;
  const token = cookies().get('auth_token');

  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    const attacker = await prisma.user.findUnique({
      where: { username: token.value },
    });

    const defender = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!attacker || !defender) {
      return NextResponse.json({ error: "Utilizator inexistent" }, { status: 404 });
    }

    if (attacker.id === defender.id) {
        return NextResponse.json({ message: "Nu te poți ataca pe tine însuți." }, { status: 400 });
    }

    // Logică de bază a luptei
    const battleRoll = Math.random();

    if (battleRoll > 0.5) {
      // Atac reușit
      const moneyStolen = Math.floor(defender.money * 0.1);
      await prisma.user.update({
        where: { id: attacker.id },
        data: {
          money: { increment: moneyStolen },
          wins: { increment: 1 },
        },
      });
      await prisma.user.update({
        where: { id: defender.id },
        data: {
          money: { decrement: moneyStolen },
          losses: { increment: 1 },
        },
      });
      return NextResponse.json({ message: `Luptă câștigată! Ai furat $${moneyStolen} de la ${defender.username}.` });
    } else {
      // Atac eșuat
      await prisma.user.update({
        where: { id: attacker.id },
        data: {
          losses: { increment: 1 },
        },
      });
      await prisma.user.update({
        where: { id: defender.id },
        data: {
          wins: { increment: 1 },
        },
      });
      return NextResponse.json({ message: `Luptă pierdută împotriva lui ${defender.username}.` });
    }
  } catch (error) {
    console.error("Eroare la luptă:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}