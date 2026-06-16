// src/lib/utils/__tests__/auth.test.ts
import { describe, it, expect } from "vitest"
import { registerSchema, changePasswordSchema } from "@/src/lib/validations/auth"

describe("registerSchema", () => {
  it("valide une inscription correcte", () => {
    const result = registerSchema.safeParse({
      name: "Marie Dupont",
      email: "marie@example.com",
      password: "Secure123",
    })
    expect(result.success).toBe(true)
  })

  it("rejette un email invalide", () => {
    const result = registerSchema.safeParse({
      name: "Marie",
      email: "pas-un-email",
      password: "Secure123",
    })
    expect(result.success).toBe(false)
    expect(result.error?.errors[0].message).toBe("Format d'email invalide")
  })

  it("rejette un mot de passe trop court", () => {
    const result = registerSchema.safeParse({
      name: "Marie",
      email: "marie@example.com",
      password: "Ab1",
    })
    expect(result.success).toBe(false)
    expect(result.error?.errors[0].message).toContain("8 caractères")
  })

  it("rejette un mot de passe sans majuscule", () => {
    const result = registerSchema.safeParse({
      name: "Marie",
      email: "marie@example.com",
      password: "secure123",
    })
    expect(result.success).toBe(false)
    expect(result.error?.errors[0].message).toContain("majuscule")
  })

  it("rejette un mot de passe sans chiffre", () => {
    const result = registerSchema.safeParse({
      name: "Marie",
      email: "marie@example.com",
      password: "Securepass",
    })
    expect(result.success).toBe(false)
    expect(result.error?.errors[0].message).toContain("chiffre")
  })

  it("rejette un nom vide", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "marie@example.com",
      password: "Secure123",
    })
    expect(result.success).toBe(false)
  })

  it("accepte les pronoms comme champ optionnel", () => {
    const result = registerSchema.safeParse({
      name: "Marie",
      email: "marie@example.com",
      password: "Secure123",
      pronoms: "elle/la",
    })
    expect(result.success).toBe(true)
  })
})

describe("changePasswordSchema", () => {
  it("valide un changement de mot de passe correct", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass1",
      newPassword: "NewPass1",
    })
    expect(result.success).toBe(true)
  })

  it("rejette un nouveau mot de passe sans majuscule", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass1",
      newPassword: "newpass1",
    })
    expect(result.success).toBe(false)
    expect(result.error?.errors[0].message).toContain("majuscule")
  })

  it("rejette si currentPassword est vide", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "",
      newPassword: "NewPass1",
    })
    expect(result.success).toBe(false)
  })
})