// app/api/map/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Asigură-te că ai un fișier prisma.ts

// RUTA GET: Preia toate teritoriile de pe hartă
export async function GET() {
  try {
    const territories = await prisma.mapTerritory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        owner: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(territories, { status: 200 });
  } catch (error) {
    console.error("Eroare la preluarea teritoriilor de pe hartă:", error);
    return NextResponse.json({ error: "Eroare internă a serverului" }, { status: 500 });
  }
}

// RUTA POST: Preia controlul asupra unui teritoriu
export async function POST(req: Request) {
  try {
    const { territoryId, userId } = await req.json();

    if (!territoryId || !userId) {
      return NextResponse.json({ error: "ID-ul teritoriului și ID-ul utilizatorului sunt obligatorii." }, { status: 400 });
    }

    // Aici poți adăuga logica pentru a verifica dacă utilizatorul poate prelua teritoriul.
    // De exemplu, poți verifica dacă utilizatorul este membru al unui clan sau dacă este suficient de puternic.
    
    // Simulează preluarea controlului
    const updatedTerritory = await prisma.mapTerritory.update({
      where: { id: territoryId },
      data: { ownerId: userId, last_conquered: new Date() },
    });

    return NextResponse.json(updatedTerritory, { status: 200 });
  } catch (error) {
    console.error("Eroare la preluarea controlului:", error);
    return NextResponse.json({ error: "Eroare internă a serverului" }, { status: 500 });
  }
}