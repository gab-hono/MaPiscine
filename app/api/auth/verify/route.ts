//app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session invalide ou expirée" }, { status: 401 });
  }

  return NextResponse.json({
    userId: session.user.id,
    role: session.user.role,
  });
}