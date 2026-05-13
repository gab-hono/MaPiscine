import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  if (req.method === 'GET' && req.nextUrl.pathname === '/api/avis') {
    return NextResponse.next()
  }

  // Intentar obtener el token — primero del header Bearer, luego de la cookie Better Auth
  let token = req.headers.get("authorization")?.replace("Bearer ", "")

  // Better Auth guarda la sesión dans la cookie "better-auth.session_token"
  if (!token) {
    const cookieValue = req.cookies.get("better-auth.session_token")?.value ?? null
  if (cookieValue) {
  // Decodifica la URL y extrae la parte antes del punto
  token = decodeURIComponent(cookieValue).split(".")[0]
}
  }

  if (!token) {
    return NextResponse.json(
      { error: "Authentication requise" },
      { status: 401 }
    )
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if (!verifyResponse.ok) {
    return NextResponse.json(
      { error: "Session invalide ou expirée" },
      { status: 401 }
    )
  }

  const { userId, role } = await verifyResponse.json()
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-user-id", userId)
  requestHeaders.set("x-user-role", role)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    "/api/favoris/:path*",
    "/api/avis/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ]
}