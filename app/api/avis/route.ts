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
        const piscine = await prisma.piscine.findUnique({ where: { id: piscineId } })
        if(!piscine || typeof piscineId !== "number") {
            return NextResponse.json({ error: "Piscine non trouvée ou inexistante"}, { status: 404 })
        }

        /* Verificar que el usuario no ha dejado ya un avis de esta piscina */
        const existingAvis = await prisma.avis.findUnique({ where: {
            userId_piscineId: { userId, piscineId }
        }})

        if (existingAvis) {
            return NextResponse.json({ error: "Cet utilisateur a déjà laissé un avis sur cette piscine" }, { status: 409 })
        }

        /* Verificar que al menos uno de los criterios se completa */
        const oneChamp =
        noteAccessibilite !== undefined ||
        comAccessibilite !== undefined ||
        noteAccueil !== undefined ||
        comAccueil !== undefined ||
        noteBassin !== undefined ||
        comBassin !== undefined ||
        noteVestiaire !== undefined ||
        comVestiaire !== undefined

        if(!oneChamp) {
            return NextResponse.json({ error: "Il faut remplir au moins un champ d'évaluation" }, { status : 400 })
        }

        /* Verificar que las notas estén entre 0 y 5 */
        const notes = [noteAccessibilite, noteAccueil, noteBassin, noteVestiaire]
        .filter(n => n !== undefined)

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