//app/api/favoris/[psicineId]

import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{id: string}>}
) {
    try {
        
        const userId = request.headers.get("x-user-id")
        
        if(!userId) {
            return NextResponse.json({
                error: "Non authentifié"
            }, { status: 401})
        }

        const { id } = await params
        const piscineId = parseInt(id)

        if(isNaN(piscineId)) {
            return NextResponse.json(
                    { error: "Error avec l'id" },
                    { status: 400 })
        }

        const favori = await prisma.favori.findUnique({
            where: { userId_piscineId: { userId, piscineId } },
        });

        if(!favori) {
            return NextResponse.json({ error: "Favori non trouvé"}, { status: 404 });
        }

        await prisma.favori.delete({
            where: { userId_piscineId: { userId, piscineId }},
        });

        return NextResponse.json({ message: "Favori supprimé" }, { status: 200 });

    } catch(error) {
        return NextResponse.json({ error: "Erreur de serveur" }, { status: 500 });
    }
}