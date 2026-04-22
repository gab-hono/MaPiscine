//src/app/api/piscines/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'



/* export async function GET() {
  try {
    const piscines = await prisma.piscine.findMany({
      include: {
        bassins: true,
        horaires_reguliers: true,
      }
    })
    return NextResponse.json(piscines)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} */