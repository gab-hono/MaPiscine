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

        

    } catch {

    }
}