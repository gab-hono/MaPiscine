import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const piscineId = parseInt(id)

    if (isNaN(piscineId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      )
    }

    const piscine = await prisma.piscine.findUnique({
      where: { id: piscineId },
      include: {
        bassins: true,
        horaires_reguliers: true,
        horaires_exceptions: true,
      }
    })

    if (!piscine) {
      return NextResponse.json(
        { error: 'Piscine non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(piscine)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}