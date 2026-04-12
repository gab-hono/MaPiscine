import { NextRequest, NextResponse } from "next/server";

export function checkRole(req: NextRequest, requiredRole: "ADMIN" | "USER") {
  const userRole = req.headers.get("x-user-role");

  if (!userRole) {
    return NextResponse.json(
      { error: "Authentication requise" },
      { status: 401 }
    );
  }

  if (requiredRole === "ADMIN" && userRole !== "ADMIN") {
    return NextResponse.json(
      { error: "Accès réservé aux administrateurs" },
      { status: 403 }
    );
  }

  return null; // null significa que el rol es válido, puede continuar
}