import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    // connectionString: "postgres://user:password@localhost:5434/database?options=-c search_path=auth",
    options: "-c search_path=auth",
    connectionString: process.env.DATABASE_URL,
  }),
})

// import { betterAuth } from "better-auth"
// import { anonymous, magicLink } from "better-auth/plugins"
// import { Kysely, PostgresDialect } from "kysely"
// import nodemailer from "nodemailer"
// import { Pool } from "pg"
// import Cursor from "pg-cursor"
// // import { db as mainDb } from "../../db/database"
import type { Session, User } from "../../db/types"

// // Use pg Pool for Better Auth (works in both Bun and Node.js)
// // This allows Better Auth CLI to read the config without Bun import errors
// const db = new Kysely<Database>({
//   dialect: new PostgresDialect({
//     cursor: Cursor,
//     pool: new Pool({
//       connectionString: process.env.DATABASE_URL,
//       max: 10,
//     }),
//   }),
// })

// // SMTP transport for magic link emails (MailDev in dev, configure for production)
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "localhost",
//   port: Number(process.env.SMTP_PORT || 1025),
//   secure: false,
// })

// export const auth = betterAuth({
//   appName: "keLLeMes API",
//   baseURL: process.env.API_URL,
//   basePath: "/api/auth",
//   logger: {
//     log: console.log,
//     level: "info",
//   },
//   database: {
//     db,
//     type: "postgres",
//   },
//   advanced: {
//     database: {
//       generateId: () => crypto.randomUUID(),
//     },
//   },
//   experimental: { joins: true },
//   secret: process.env.BETTER_AUTH_SECRET,
//   emailAndPassword: {
//     enabled: false,
//   },
//   user: {
//     fields: {
//       emailVerified: "email_verified",
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   },
//   session: {
//     fields: {
//       userId: "user_id",
//       expiresAt: "expires_at",
//       ipAddress: "ip_address",
//       userAgent: "user_agent",
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   },
//   account: {
//     fields: {
//       userId: "user_id",
//       accountId: "account_id",
//       providerId: "provider_id",
//       accessToken: "access_token",
//       refreshToken: "refresh_token",
//       idToken: "id_token",
//       accessTokenExpiresAt: "access_token_expires_at",
//       refreshTokenExpiresAt: "refresh_token_expires_at",
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   },
//   verification: {
//     fields: {
//       expiresAt: "expires_at",
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   },
//   plugins: [
//     magicLink({
//       sendMagicLink: async ({ email, url }) => {
//         try {
//           const result = await transporter.sendMail({
//             from: process.env.EMAIL_FROM || "noreply@kellemes.app",
//             to: email,
//             subject: "Sign in to keLLeMes",
//             html: `
//               <h1>Sign in to keLLeMes</h1>
//               <p>Click the link below to sign in:</p>
//               <a href="${url}">${url}</a>
//               <p>This link expires in 5 minutes.</p>
//             `,
//           })
//           console.log("Email sent:", result.messageId)
//         } catch (err) {
//           console.error("Failed to send email:", err)
//           throw err
//         }
//       },
//     }),
//     anonymous({
//       emailDomainName: "anon.kellemes.app",
//       schema: {
//         user: {
//           fields: {
//             isAnonymous: "is_anonymous",
//           },
//         },
//       },
//     }),
//   ],
// })

// Get session by token for CLI/API authentication
export async function getSessionByToken(_token: string): Promise<{ session: Session; user: User } | null> {
  // const session = await mainDb
  //   .selectFrom("session")
  //   .selectAll()
  //   .where("token", "=", token)
  //   .where("expiresAt", ">", new Date())
  //   .executeTakeFirst()

  // if (!session) return null

  // const user = await mainDb.selectFrom("user").selectAll().where("id", "=", session.userId).executeTakeFirst()

  // if (!user) return null

  return (await auth.api.getSession()) as { session: Session; user: User }
  // const user = await auth.api.accountInfo()
  // @ts-ignoore
  // return { session, user }
}
