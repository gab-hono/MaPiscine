//app/api/avis/route.ts

import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* Generar ruta POST para un avis (puede existir sólo si un usuario esta autentificado) */

export async function POST(req: NextRequest) {

    try {
        const userId = req.headers.get("x-user-id")

        if(!userId) {
            return NextResponse.json({
                error: "Non authentifié.e"
            }, { status: 401 })
        };

        /* Recuperar el id de la piscina a través del body de la request */
        const body = await req.json()
        const { piscineId, 
            noteAccessibilite, 
            comAccessibilite, 
            noteAccueil, 
            comAccueil, 
            noteBassin, 
            comBassin, 
            noteVestiaire, 
            comVestiaire } = body;

        /* Verificar que la piscina existe */
        if (!piscineId || typeof piscineId !== "number") {
            return NextResponse.json({ error: "Piscine ID invalide ou inexistant" }, { status: 400 })
        }

        const piscine = await prisma.piscine.findUnique({ where: { id: piscineId } })
        if (!piscine) {
            return NextResponse.json({ error: "Piscine non trouvée" }, { status: 404 })
        };

        /* Verificar que el usuario no ha dejado ya un avis de esta piscina */
        const existingAvis = await prisma.avis.findUnique({ where: {
            userId_piscineId: { userId, piscineId }
        }})

        if (existingAvis) {
            return NextResponse.json({ error: "Cet utilisateur a déjà laissé un avis sur cette piscine" }, { status: 409 })
        }

        /* Verificar que al menos uno de los criterios se completa */
        const allNotes =
        noteAccessibilite !== undefined &&
        noteAccueil !== undefined &&
        noteBassin !== undefined &&
        noteVestiaire !== undefined

        if(!allNotes) {
            return NextResponse.json({ error: "Il faut mettre des notes sur tous les champs, les commentaires sont optionnels" }, { status : 400 })
        }

        /* Verificar que las notas estén entre 0 y 5 */
        const notes = [noteAccessibilite, noteAccueil, noteBassin, noteVestiaire];

        const notesValides = notes.every(n => typeof n === 'number' && n >= 0 && n <= 5);

        if(!notesValides) {
            return NextResponse.json({ error: "Les notes doivent être comprises entre 0 et 5"}, { status: 400 })
        };


        /* Crear un avis que vincule el userId con piscineId */
        const avis = await prisma.avis.create({
            data: { userId,
                piscineId,
                note_accessibilite : noteAccessibilite, 
                commentaire_accessibilite : comAccessibilite, 
                note_accueil : noteAccueil, 
                commentaire_accueil : comAccueil, 
                note_bassin : noteBassin, 
                commentaire_bassin : comBassin, 
                note_vestiaires : noteVestiaire, 
                commentaire_vestiaires : comVestiaire}
        })

        return NextResponse.json({ data: avis }, { status: 201 })

    } catch(error) {
        console.error('Erreur POST api/avis:', error)
        return NextResponse.json({ error: "Erreur serveur"}, { status: 500 });
    }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('piscineId')

    // Validar que se envía y que es numérico
    if (!raw) {
      return NextResponse.json({ error: "piscineId manquant" }, { status: 400 })
    }

    const piscineId = parseInt(raw)
    if (isNaN(piscineId)) {
      return NextResponse.json({ error: "piscineId invalide" }, { status: 400 })
    }

    // Verificar que la piscine existe
    const piscine = await prisma.piscine.findUnique({ where: { id: piscineId } })
    if (!piscine) {
      return NextResponse.json({ error: "Piscine non trouvée" }, { status: 404 })
    }

    // Devolver los avis sin exponer userId
    const avis = await prisma.avis.findMany({
      where: { piscineId },
      select: {
        id: true,
        note_accessibilite: true,
        commentaire_accessibilite: true,
        note_accueil: true,
        commentaire_accueil: true,
        note_bassin: true,
        commentaire_bassin: true,
        note_vestiaires: true,
        commentaire_vestiaires: true,
        created_at: true,
        piscineId: true,
        // userId excluido intencionalmente
      }
    })

    return NextResponse.json({ data: avis }, { status: 200 })

  } catch (error) {
    console.error('Erreur GET /api/avis:', error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}