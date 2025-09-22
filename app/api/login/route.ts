// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Nume de utilizator sau parolă incorecte." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Nume de utilizator sau parolă incorecte." }, { status: 401 });
    }

    cookies().set('auth_token', user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Returnăm numele de utilizator pentru a-l folosi la redirecționare
    return NextResponse.json({ message: "Autentificare reușită!", username: user.username }, { status: 200 });

  } catch (error) {
    console.error("Eroare la autentificarea utilizatorului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}