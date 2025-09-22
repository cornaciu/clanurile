// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('auth_token');
  return NextResponse.json({ message: "Delogare reușită." }, { status: 200 });
}