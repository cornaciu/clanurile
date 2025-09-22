// app/api/auth-status/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const hasToken = cookies().has('auth_token');

  if (!hasToken) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  const token = cookies().get('auth_token');
  if (!token || !token.value) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: token.value,
      },
    });

    if (!user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    return NextResponse.json({ isAuthenticated: true, user: user }, { status: 200 });
  } catch (error) {
    console.error("Eroare la verificarea stării de autentificare:", error);
    return NextResponse.json({ isAuthenticated: false, error: "Eroare internă de server" }, { status: 500 });
  }
}