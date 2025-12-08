import { betterAuth } from "better-auth"
import { anonymous, magicLink } from "better-auth/plugins"
import { Kysely, PostgresDialect } from "kysely"
import nodemailer from "nodemailer"
import { Pool } from "pg"
import { db as mainDb } from "../../db/database.js"
import type { Database, Session, User } from "../../db/types.js"

// Use pg Pool for Better Auth (works in both Bun and Node.js)
// This allows Better Auth CLI to read the config without Bun import errors
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT || 5432),
      database: process.env.POSTGRES_DB || "kellemes",
      user: process.env.POSTGRES_USER || "kellemes",
      password: process.env.POSTGRES_PASSWORD || "",
      max: 10,
    }),
  }),
})

// SMTP transport for magic link emails (MailDev in dev, configure for production)
console.log("SMTP", {
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
})
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
})

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  experimental: { joins: true },
  secret: process.env.BETTER_AUTH_SECRET || "change-me",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
  emailAndPassword: {
    enabled: false,
  },
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log("sendMagicLink", { email, url })
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || "noreply@kellemes.app",
          to: email,
          subject: "Sign in to keLLeMes",
          html: `
            <h1>Sign in to keLLeMes</h1>
            <p>Click the link below to sign in:</p>
            <a href="${url}">${url}</a>
            <p>This link expires in 5 minutes.</p>
          `,
        })
      },
    }),
    anonymous({
      emailDomainName: "anon.kellemes.app",
      schema: {
        user: {
          fields: {
            isAnonymous: "is_anonymous",
          },
        },
      },
    }),
  ],
})

// Get session by token for CLI/API authentication
export async function getSessionByToken(token: string): Promise<{ session: Session; user: User } | null> {
  const session = await mainDb
    .selectFrom("session")
    .selectAll()
    .where("token", "=", token)
    .where("expiresAt", ">", new Date())
    .executeTakeFirst()

  if (!session) return null

  const user = await mainDb.selectFrom("user").selectAll().where("id", "=", session.userId).executeTakeFirst()

  if (!user) return null

  return { session, user }
}
