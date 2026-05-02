//app/api/admin/piscines/[id]/route.ts

/* Route GET pour que un.e admin puisse voir les données de sa piscine asignée */

import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }>}) {
    try{
        /*Verificar que hay ID en la req */
        const userId = req.headers.get("x-user-id")
        if(!userId){
            return NextResponse.json({ error: "Auhenification requise" }, { status: 401 })
        };

        /* Verificar rol admin */
        const isAdmin = req.headers.get("x-user-role");
        if(isAdmin !== "ADMIN"){
            return NextResponse.json({ error: "Accès interdit" }, { status: 403 })
        };

        /*Extraer id de la piscine de params*/
        const { id } = await params
        const piscineId = parseInt(id);

        if(isNaN(piscineId)){
            return NextResponse.json({ error: "ID piscine invalide" }, { status: 400})
        };

        /* Verificar que el id de piscine corresponde a la asignada a ese admin*/
        const admin = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!admin || admin.piscineId !== piscineId){
            return NextResponse.json({ error: "Accès interdit à cette piscine" }, { status: 403 })
        };

        /*Devolver los datos de su piscina*/
        const dataPiscine = await prisma.piscine.findUnique({
            where: { id: piscineId },
            include: { 
                bassins: true,
                horaires_reguliers: true,
                horaires_exceptions: true,
                avis: {
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
                        created_at: true
                    }
                }
             }
        })

        if(!dataPiscine) {
            return NextResponse.json({ error: "Piscine non trouvée" }, { status: 404 })
        };

        return NextResponse.json({ data: dataPiscine }, { status: 200 })

    }catch(error){
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}