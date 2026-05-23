import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {

  if (req.method === 'GET' && req.nextUrl.pathname === '/api/avis') {

    const cookieValue = req.cookies.get("better-auth.session_token")?.value ?? null
    if (!cookieValue) return NextResponse.next()

    const token = decodeURIComponent(cookieValue).split(".")[0]
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000"
    const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: { authorization: `Bearer ${token}` },
    })
    if (!verifyResponse.ok) return NextResponse.next() // token inválido → anónimo

    const { userId, role } = await verifyResponse.json()
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set("x-user-id", userId)
    requestHeaders.set("x-user-role", role)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  let token = req.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    const cookieValue = req.cookies.get("better-auth.session_token")?.value ?? null
  if (cookieValue) {

    token = decodeURIComponent(cookieValue).split(".")[0]
}
  }

  if (!token) {
    return NextResponse.json(
      { error: "Authentication requise" },
      { status: 401 }
    )
  }

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000"
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