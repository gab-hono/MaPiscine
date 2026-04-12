import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, pronoms } = body;

    // Validar campos obligatorios
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont obligatoires" },
        { status: 400 }
      );
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validar longitud password
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // Registrar el usuario via Better Auth API
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Origin": baseUrl,  // ← añadir esta línea
        },
        body: JSON.stringify({ name, email, password }),
        });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Erreur lors de l'inscription" },
        { status: response.status }
      );
    }

    // Ajouter les champs personnalisés si fournis
    if (pronoms) {
      await prisma.user.update({
        where: { email },
        data: { pronoms },
      });
    }

    // Devolver usuario creado sin datos sensibles
    const newUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        pronoms: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("Erreur register:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}