// app/api/user/set-avatar/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const token = cookies().get('auth_token');
  if (!token) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const { avatarUrl } = await request.json();

  if (!avatarUrl || !avatarUrl.startsWith('/avatars/')) {
    return NextResponse.json({ error: "URL de avatar invalid." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username: token.value } });

    if (!user) {
      return NextResponse.json({ error: "Utilizator inexistent." }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: avatarUrl },
    });

    return NextResponse.json({ message: "Avatar actualizat cu succes!", user: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Eroare la actualizarea avatarului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}