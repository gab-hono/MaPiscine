//app/api/avis/route.ts

import { error } from "console";
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

        /* Verificar que al menos uno de los criterios se completa */

        /* Verificar que la piscina existe */

        /* Verificar que el usuario no ha dejado ya un avis de esta piscina */

        /* Crear un avis que vincule el userId con piscineId */



    } catch(error) {
        console.error('Erreur POST api/avis:', error)
        return NextResponse.json({ error: "Erreur serveur"}, { status: 500 });
    }
}