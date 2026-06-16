// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { auth } from "@/src/lib/auth"
import { registerSchema } from "@/src/lib/validations/auth"
import { ZodError } from "zod"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0].message
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { name, email, password, pronoms } = parsed.data

    // Verificar unicidad del email antes de intentar crear
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      )
    }

    // Llamada directa a Better Auth — sin HTTP interno
    const signUpResult = await auth.api.signUpEmail({
      body: { name, email, password },
    })

    if (!signUpResult?.user) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 500 }
      )
    }

    // Ajouter les champs personnalisés
    if (pronoms) {
      await prisma.user.update({
        where: { email },
        data: { pronoms },
      })
    }

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
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error("Erreur register:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}