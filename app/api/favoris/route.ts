//app/api/favoris/route.ts
/* Generar ruta POST de un favori */

import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    
    try {
        const userId = req.headers.get("x-user-id")
        
        if(!userId) {
            return NextResponse.json({
                error: "Non authentifié"
            }, { status: 401})
        }
        
        //We get the pool ID from the body of the request
        const body = await req.json()
        const { piscineId } = body
        
        //if there's no piscine in the body, the response asks for an id :
        if(!piscineId || typeof piscineId !== "number") {
            return NextResponse.json({ error: "Piscine manquante, vous devez fournir un id de piscine" }, { status: 400 })
        }
        
        //We verify the pool exist in our database
        const piscine = await prisma.piscine.findUnique({ where: { id: piscineId } })
        if(!piscine) {
            return NextResponse.json({ error: "Piscine non trouvée ou inexistante"}, { status: 404 })
        }
        
        //We verify the favorite doesn't already exists
        const existingFav = await prisma.favori.findUnique({ where: {
            userId_piscineId: { userId, piscineId }
        }})
        
        //If a favorite already exist, throw error on can't duplicate
        if(existingFav) {
            return NextResponse.json({ error: "Ce favori existe déjà. Impossible de dupliquer"}, { status: 409 })
        }
        
        //creation of the favorite
        const favori = await prisma.favori.create({
            data: { userId, piscineId }
        })
        
        return NextResponse.json({ data: favori }, { status: 201 })

    } catch(error) {
        console.error('Erreur POST /api/favoris:', error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
        }
}