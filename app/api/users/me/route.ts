//app/api/users/me/route.ts
/* Ruta de GET y PATCH de un usuario autenticado */

import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

/* GET : Obtenemos los datos del user (protegendo contraseña) */
export async function GET(req: Request) {
    try {
        /* Protegemos la ruta. Solo authentified puede acceder */
        const userId = req.headers.get("x-user-id")

        if(!userId) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        /* Devolución de datos: Sin contraseña y con conteo de favs y avis */

        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: { 
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                pronoms: true,
                role: true,
                _count: {
                    select : {
                        favoris: true,
                        avis: true,
                    }
                }
             }
        })

        if(!userData){
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
        }

        return NextResponse.json({ data: userData }, { status: 200 })
    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {

    try {
    /* Protección de ruta */
    const userId = req.headers.get("x-user-id");

    if(!userId){
        return NextResponse.json({ error: "Non Authentifié" }, { status: 401 })
    };

    /* Obtener los datos que se cambian a través del body */
    const body = await req.json();
    const { 
        name,
        image,
        pronoms
        } = body;
    
    /* Verificar los tipos de datos */
    if(name !== undefined && typeof name !== "string"){
        return NextResponse.json({ error: "Format de données de 'name' incorrect" }, { status: 400 })
    }

    if(image !== undefined && typeof image !== "string"){
        return NextResponse.json({ error: "Format de données de l'image incorrect" }, { status: 400 })
    }

    if(pronoms !== undefined && typeof pronoms !== "string"){
        return NextResponse.json({ error: "Format de données des pronoms incorrect" }, { status: 400 })
    }

    /* Construcción dinámica de objeto "data" para actualizar patch sin borrar datos */
    const data: { name?: string; pronoms?: string; image?: string} = {};

    if(name !== undefined) data.name = name;
    if(image !== undefined) data.image = image;
    if(pronoms !== undefined) data.pronoms = pronoms;

    /* Guard en el caso de que todos los campos sean undefined */
    if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 })
    }
    
    /* Construcción del patch */
    const newData = await prisma.user.update({
        where: { id: userId },
        data
    })

    /* Update correcto */
    return NextResponse.json({ data: newData }, { status: 200 })

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}