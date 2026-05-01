//app/api/users/me/password.route.ts

import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/* RUTA PATCH PARA MODIFICAR PASSWORD DE USUARIO */

export async function PATCH(req: Request) {
    try {

        /* Protección de ruta */
        const userId = req.headers.get("x-user-id");
        if(!userId){
            return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
        };

        /* Leer currentPassword y newPassword del body */
        const body = await req.json()
        const { currentPassword, newPassword } = body;
        
        /* Verificar que ambos están presentes y que son strings */
        if(typeof currentPassword !== "string" || typeof newPassword !== "string"){
            return NextResponse.json({ error: "Données incorrectes ou manquantes" }, { status: 400 })
        };

        /* Buscar el usuario en la bdd con su passwors hasheado */
        const user = await prisma.account.findFirst({ 
            where: { userId: userId,
                providerId: "credential"
             },
            select: { password: true }
        })

        if(!user){
            return NextResponse.json({ error: "Utilisateur non trouvé.e" }, { status: 404 })
        };

        /* Verificar que currentPassword coincide con el hash almacenado (usar bcrypt.compare) */
        const passwordValide = await bcrypt.compare(currentPassword, user.password!)
        if(!passwordValide) {
            return NextResponse.json({ error: "Mot de passe actual incorrect" }, { status: 401 })
        };      

        /* Verificar que newPassword tiene al menos 8 car. */
        if (newPassword.length < 8) {
              return NextResponse.json(
                { error: "Le mot de passe doit contenir au moins 8 caractères" },
                { status: 400 }
              );
            }

        /* Hashear el newPassword (bcrypt.hash) */
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        /* Actualizar el password de la bdd */
        await prisma.account.updateMany({
            where: { userId: userId,
                    providerId: "credential"
             },
            data: { password: hashedPassword }
        })

        /* return 200 */
        return NextResponse.json({ message: "Mot de passe mis à jour" }, { status: 200 });

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}