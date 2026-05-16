// src/lib/utils/checkRoleLogic.ts

/* Vérifie si le rôle de l'utilisateur est suffisant
pour accéder à une fonctionnalité  */

export function checkRoleLogic(
    userRole: string | null,
    requiredRole: "ADMIN" | "USER"
): { error: string; status: number } | null {
    if (!userRole) {
        return { error: "Authentication requise", status: 401 }
    }

    if (requiredRole === "ADMIN" && userRole !== "ADMIN") {
        return { error: "Accès réservé aux administrateurs", status: 403 }
    }

    return null
}