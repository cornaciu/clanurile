// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Verifică dacă utilizatorul există deja
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Numele de utilizator există deja." }, { status: 409 });
    }

    // Criptează parola înainte de a o salva
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Creează un nou utilizator în baza de date
    const newUser = await prisma.user.create({
      data: {
        username: username,
        passwordHash: passwordHash,
      },
    });

    return NextResponse.json({ message: "Înregistrare reușită!", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Eroare la înregistrarea utilizatorului:", error);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}