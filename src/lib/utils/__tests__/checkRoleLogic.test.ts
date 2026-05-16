import { describe, it, expect } from "vitest"
import { checkRoleLogic } from "../checkRoleLogic"

describe("checkRoleLogic", () => {
    
    it('retourne 401 si aucun rôle fourni', () => {
        expect(checkRoleLogic(null, "USER"))
            .toEqual({
                "error": "Authentication requise",
                "status": 401,
                })
    })

    it('retourne 403 si rôle USER tente accès ADMIN', () => {
        expect(checkRoleLogic("USER", "ADMIN"))
            .toEqual({
                "error": "Accès réservé aux administrateurs",
                "status": 403,
                })
    })

    it('retourne null si rôle ADMIN accède ressource ADMIN', () => {
        expect(checkRoleLogic("ADMIN", "ADMIN")).toEqual(null)
    })

    it('retourne null si rôle USER accède ressource USER', () => {
        expect(checkRoleLogic("USER", "USER")).toEqual(null)
    })    
})
