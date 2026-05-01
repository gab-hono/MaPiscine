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

/* función PATCH para que un user pueda modificar su propio avis */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try{
        /* Protección de ruta */
        const userId = req.headers.get("x-user-id")
        if(!userId){
            return NextResponse.json({ error: "Non authentifié.e" }, { status: 401 })
        };

        /* Validar que el id del avis existe en la bdd */
        const { id } = await params;
        const avis = await prisma.avis.findUnique({ where: { id }})
        if(!avis){
            return NextResponse.json({ error: "Avis non trouvé ou inexistant dans la base des données" }, { status: 404 })
        };

        /* Verificar que el avis pertenece al user que hace la req */
        if(avis.userId !== userId){
            return NextResponse.json({ error: "Non authorisé" }, { status: 403 })
        };
        
        /* Validar que al menos una nota o comentario se envía en el body */
        const body = await req.json();
        const { noteAccessibilite,
                comAccessibilite,
                noteAccueil,
                comAccueil,
                noteBassin,
                comBassin,
                noteVestiaire,
                comVestiaire } = body
        
        const noChange =
            noteAccessibilite === undefined &&
            comAccessibilite === undefined &&
            noteAccueil === undefined &&
            comAccueil === undefined &&
            noteBassin === undefined &&
            comBassin === undefined &&
            noteVestiaire === undefined &&
            comVestiaire === undefined

        if(noChange){
            return NextResponse.json({ error: "Envoyer au moins un changement" }, { status: 400 })
        };
        
        /* Validar que las notas están entre 0 y 5 */
        const notes = [noteAccessibilite, noteAccueil, noteBassin, noteVestiaire];

        const notesValides = notes
            .filter(n => n !== undefined)
            .every(n => typeof n === 'number' && n >= 0 && n <= 5)
        
        if(!notesValides) {
            return NextResponse.json({ error: "Les notes doivent être comprises entre 0 et 5"}, { status: 400 })
        };

        /* Actualizar SOLO los campos modificados */
        const data: {
            note_accessibilite?: number
            commentaire_accessibilite?: string
            note_accueil?: number
            commentaire_accueil?: string
            note_bassin?: number
            commentaire_bassin?: string
            note_vestiaires?: number
            commentaire_vestiaires?: string
        } = {}

        if (noteAccessibilite !== undefined) data.note_accessibilite = noteAccessibilite
        if (comAccessibilite !== undefined) data.commentaire_accessibilite = comAccessibilite
        if (noteAccueil !== undefined) data.note_accueil = noteAccueil
        if (comAccueil !== undefined) data.commentaire_accueil = comAccueil
        if (noteBassin !== undefined) data.note_bassin = noteBassin
        if (comBassin !== undefined) data.commentaire_bassin = comBassin
        if (noteVestiaire !== undefined) data.note_vestiaires = noteVestiaire
        if (comVestiaire !== undefined) data.commentaire_vestiaires = comVestiaire

        const newData = await prisma.avis.update({
            where: { id: avis.id },
            data
        })

        return NextResponse.json({ data: newData }, { status: 200 })
    } catch(error){
        console.error(error)
        return NextResponse.json({ error: "Erreur serveur"}, { status: 500 })
    }
}