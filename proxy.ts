import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  if (req.method === 'GET' && req.nextUrl.pathname === '/api/avis') {
    return NextResponse.next()
  }
  
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "Authentication requise" },
      { status: 401 }
    );
  }

  // Verificar el token llamando al endpoint interno
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!verifyResponse.ok) {
    return NextResponse.json(
      { error: "Session invalide ou expirée" },
      { status: 401 }
    );
  }

  const { userId, role } = await verifyResponse.json();

  // Pasar userId y role a los Route Handlers via headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", userId);
  requestHeaders.set("x-user-role", role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/api/favoris/:path*",
    "/api/avis/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ]
};