import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

// With CamelCasePlugin: define types in camelCase, Kysely converts to snake_case for DB queries.
// Table names are also converted (e.g., qaVectors -> qa_vectors).
// All primary keys use UUID with gen_random_uuid() default in PostgreSQL.

export interface Database {
  qaVectors: QAVectorsTable
  user: UserTable
  session: SessionTable
  account: AccountTable
  verification: VerificationTable
}

export interface QAVectorsTable {
  id: Generated<string>
  question: string
  answer: string
  embedding: string // pgvector stored as string, converted to number[] in queries
}

export type QAVector = Selectable<QAVectorsTable>
export type NewQAVector = Insertable<QAVectorsTable>
export type QAVectorUpdate = Updateable<QAVectorsTable>

// Auth tables (better-auth)
export interface UserTable {
  id: Generated<string>
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  isAnonymous: ColumnType<boolean, boolean | undefined, boolean>
  createdAt: ColumnType<Date, Date | undefined, Date>
  updatedAt: ColumnType<Date, Date | undefined, Date>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export interface SessionTable {
  id: Generated<string>
  expiresAt: Date
  token: string
  createdAt: ColumnType<Date, Date | undefined, Date>
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
}

export type Session = Selectable<SessionTable>
export type NewSession = Insertable<SessionTable>
export type SessionUpdate = Updateable<SessionTable>

export interface AccountTable {
  id: Generated<string>
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Date | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  password: string | null
  createdAt: ColumnType<Date, Date | undefined, Date>
  updatedAt: Date
}

export type Account = Selectable<AccountTable>
export type NewAccount = Insertable<AccountTable>
export type AccountUpdate = Updateable<AccountTable>

export interface VerificationTable {
  id: Generated<string>
  identifier: string
  value: string
  expiresAt: Date
  createdAt: ColumnType<Date, Date | undefined, Date>
  updatedAt: ColumnType<Date, Date | undefined, Date>
}

export type Verification = Selectable<VerificationTable>
export type NewVerification = Insertable<VerificationTable>
export type VerificationUpdate = Updateable<VerificationTable>
