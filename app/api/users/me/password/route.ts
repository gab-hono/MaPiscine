// app/api/users/me/password/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/src/lib/auth"
import { changePasswordSchema } from "@/src/lib/validations/auth"
import { headers } from "next/headers"

export async function PATCH(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = changePasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    // Déléguer à Better Auth — cohérence du hashing garantie
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    })

    return NextResponse.json(
      { message: "Mot de passe mis à jour" },
      { status: 200 }
    )
  } catch (error: unknown) {
    // Better Auth lance une erreur si currentPassword est incorrect
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("invalid")
    ) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 401 }
      )
    }
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}