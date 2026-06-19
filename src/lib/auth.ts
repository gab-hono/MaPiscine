// src/lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/src/lib/prisma"
import { resend } from "@/src/lib/resend"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "MaPiscine <onboarding@resend.dev>",
        to: user.email,
        subject: "Confirmez votre adresse email de MaPiscine",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
            <h2 style="color: #0ea5e9;">Bienvenue sur MaPiscine 🏊</h2>
            <p>Merci de vous être inscrit·e. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email sur le site MaPiscine.</p>
            <a href="${url}" style="
              display: inline-block;
              margin-top: 16px;
              padding: 12px 24px;
              background-color: #0ea5e9;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            ">Confirmer mon email</a>
            <p style="margin-top: 24px; color: #6b7280; font-size: 0.875rem;">
              Si vous n'avez pas créé de compte, ignorez cet email.
            </p>
          </div>
        `,
      })
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  secret: process.env.AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      pronoms: {
        type: "string",
        required: false,
      },
    },
  },
})