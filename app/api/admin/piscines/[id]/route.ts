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

/* Función para modificar datos de piscina administrada */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }>}){
        try{
            /* Validar que la persona hacien el req es un userAdmin */
            const userId = req.headers.get("x-user-id");
            if (!userId){
                return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
            };

            const isAdmin = req.headers.get("x-user-role");
            if(isAdmin !== "ADMIN"){
                return NextResponse.json({ error: "Accès interdit" }, { status: 403 })
            };
            
            /* Validar que el id en los params corresponde a una piscina existente */
            const { id } = await params
            const piscineId = parseInt(id);

            if(isNaN(piscineId)){
                return NextResponse.json({ error: "ID piscine invalide" }, { status: 400 })
            };

            /* Validar que el id de la piscina corresponde al asignado del admin */
            const admin = await prisma.user.findUnique({
                where: { id: userId }
            })

            if(!admin || admin.piscineId !== piscineId){
                return NextResponse.json({ error: "Accès interdit" }, { status: 403 })
            };

            /* Validar los campos editados */
            const body = await req.json();
            const { queer_friendly,
                    acces_pmr,
                    is_open,
                    espace_solarium } = body
            
            const noChange =
                queer_friendly === undefined &&
                acces_pmr === undefined &&
                is_open === undefined &&
                espace_solarium === undefined
            
                if(noChange){
                    return NextResponse.json({ error: "Envoyer au moins un changement" }, { status: 400})
                };

            /* Validar tipos */
            const data: {
                queer_friendly?: boolean
                acces_pmr?: boolean
                is_open?: boolean
                espace_solarium?: boolean
            } = {}

            if (queer_friendly !== undefined && typeof queer_friendly !== "boolean") {
                return NextResponse.json({ error: "queer_friendly doit être un booléen" }, { status: 400 })
            }
            if (acces_pmr !== undefined && typeof acces_pmr !== "boolean") {
                return NextResponse.json({ error: "acces_pmr doit être un booléen" }, { status: 400 })
            }
            if (is_open !== undefined && typeof is_open !== "boolean") {
                return NextResponse.json({ error: "is_open doit être un booléen" }, { status: 400 })
            }
            if (espace_solarium !== undefined && typeof espace_solarium !== "boolean") {
                return NextResponse.json({ error: "espace_solarium doit être un booléen" }, { status: 400 })
            }

            if (queer_friendly !== undefined) data.queer_friendly = queer_friendly;
            if (acces_pmr !== undefined) data.acces_pmr = acces_pmr;
            if (is_open !== undefined) data.is_open = is_open;
            if (espace_solarium !== undefined) data.espace_solarium = espace_solarium;

            /* Hacer el patch dinámico (sin borrar campos que no se editen) */
            const newData = await prisma.piscine.update({
                where: { id: piscineId },
                data
            })

            return NextResponse.json({ data: newData }, { status: 200 })

        }catch(error){
            console.error(error)
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
        };
    }