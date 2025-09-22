import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const token = request.cookies.get('auth_token'); // <-- Noul mod de a accesa cookie-ul

  // 1. Verifică dacă există token de autentificare
  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    // 2. Găsește utilizatorul în baza de date pe baza token-ului
    const user = await prisma.user.findUnique({
      where: { username: token.value },
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

    // 3. Verifică dacă utilizatorul a fost găsit
    if (!user) {
      return NextResponse.json({ error: "Utilizator nu a fost găsit" }, { status: 404 });
    }

    // 4. Returnează datele utilizatorului
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Eroare la preluarea datelor utilizatorului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}