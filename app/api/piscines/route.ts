//src/app/api/piscines/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { estOuverteMaintenant } from "@/src/lib/utils/horaires"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    //FILTERS
    const arrondissement = searchParams.get('arrondissement')
    const acces_pmr = searchParams.get('acces_pmr')
    const queer_friendly = searchParams.get('queer_friendly')
    const accepte_passe_paris = searchParams.get('accepte_passe_paris')
    const vestiaires_mixtes = searchParams.get('vestiaires_mixtes')
    const cabines_individuelles = searchParams.get('cabines_individuelles')
    const douches_individuelles = searchParams.get('douches_individuelles')
    const douches_collectives = searchParams.get('douches_collectives')
    const cabine_pmr = searchParams.get('cabine_pmr')
    const espace_solarium = searchParams.get('espace_solarium')
    const is_open         = searchParams.get('is_open')

    //DYNAMIC CONSTRUCTION OF "WHERE" (PRISMA)
    const where: Record<string, unknown> = {}

    if (arrondissement) where.arrondissement = Number(arrondissement);
    if (acces_pmr === 'true') where.acces_pmr = true;
    if (queer_friendly === 'true') where.queer_friendly = true;
    if (accepte_passe_paris === 'true') where.accepte_passe_paris = true;
    if (vestiaires_mixtes === 'true') where.vestiaires_mixtes = true;
    if (cabines_individuelles === 'true') where.cabines_individuelles = true;
    if (douches_collectives === 'true') where.douches_collectives = true;
    if (douches_individuelles === 'true') where.douches_individuelles = true;
    if (cabine_pmr === 'true') where.cabine_pmr = true;
    if (espace_solarium === 'true') where.espace_solarium = true

    const longueur_bassin = searchParams.get('longueur_bassin')
    if (longueur_bassin) {
      where.bassins = { some: { longueur: Number(longueur_bassin) } }
    }

    //CREATION OF PAGES
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 50);
    const skip = (page -1) * limit;

    //QUERY
    const [piscines, total] = await Promise.all([
      prisma.piscine.findMany({
        where,
        include: {
          bassins: true,
          horaires_reguliers: true,
          _count: {
            select: {
              avis: true,
            }
          }
        },
        skip,
        take: limit,
        orderBy: { arrondissement: 'asc' },
      }),
      prisma.piscine.count({ where }),
    ])

    // Calcul du statut d'ouverture en temps réel
    const piscinesAvecStatut = piscines.map((p) => {
      const ouvert = estOuverteMaintenant(p.horaires_reguliers)
      return {
        ...p,
        is_open: ouvert,
      }
    })

    const piscinesFiltrees = is_open === 'true'
    ? piscinesAvecStatut.filter((p) => p.is_open)
    : piscinesAvecStatut

    return NextResponse.json({
      data: piscinesFiltrees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })

  }
  catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}