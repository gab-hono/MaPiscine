//app/api/favoris/route.ts
/* Generar ruta POST de un favori */
/* 
- [X]  Crear src/app/api/favoris/route.ts
- [X]  Proteger la ruta: verificar sesión activa (→ 401 si no)
- [ ]  Verificar que el favori no existe ya (→ 409).
- [ ]  Crear vinculando userId del token y piscineId del body. */

import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    const userId = req.headers.get("x-user-id")

    if(!userId) {
        return NextResponse.json({
            error: "Non authentifié"
        },
            { status: 401})
    }

    //We get the pool ID from the body of the request
    const body = await req.json()
    const { piscineId } = body
    //if there's no piscine in the body, the response asks for an id :
    if(!piscineId) {
        return NextResponse.json({ error: "Piscine manquante, vous devez fournir un id de piscine" }, { status: 400 })
    }

    //We verify the pool exist in our database
    const piscine = await prisma.piscine.findUnique({ where: { id: piscineId } })
    if(!piscine) {
        return NextResponse.json({ error: "Piscine non trouvée ou inexistante"}, { status: 404 })
    }

    //We verify the favorite doesn't already exists
    

}