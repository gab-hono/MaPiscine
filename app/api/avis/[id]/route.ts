//app/api/avis/[id]/route.ts

import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server"

/* Creación de ruta con método DELETE para borrar un avis */

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
    /* Protetger la ruta ante usuario sin sesión */
    const userId = request.headers.get("x-user-id")

    if(!userId) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    };

    /* Verificar que el avis existe en la bdd */
    const { id } = await params;

    const avis = await prisma.avis.findUnique({ where : { id }})

    if(!avis) {
        return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
    };

    /* Verificar que el avis pertenece al userId */
    if (avis.userId !== userId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    };

    /* Eliminar el avis */
    await prisma.avis.delete({ where: { id: avis.id }})

    return NextResponse.json({ message: "Avis supprimé" }, { status: 200 })


    } catch(error) {
        console.error(error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}