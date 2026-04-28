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
        const { piscineId } = body;

        /* Verificar que al menos uno de los criterios se completa */


        /* Verificar que la piscina existe */
        const piscine = await prisma.piscine.findUnique({ where: { id: piscineId } })
        if(!piscine) {
            return NextResponse.json({ error: "Piscine non trouvée ou inexistante"}, { status: 404 })
        }

        /* Verificar que el usuario no ha dejado ya un avis de esta piscina */
        const existingAvis = await prisma.avis.findUnique({ where: {
            userId_piscineId: { userId, piscineId }
        }})

        /* Crear un avis que vincule el userId con piscineId */



    } catch(error) {
        console.error('Erreur POST api/avis:', error)
        return NextResponse.json({ error: "Erreur serveur"}, { status: 500 });
    }
}