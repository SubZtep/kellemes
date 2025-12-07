import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    create table "user" (
      "id" uuid primary key default gen_random_uuid(),
      "name" text not null,
      "email" text not null unique,
      "email_verified" boolean not null,
      "image" text,
      "created_at" timestamptz default CURRENT_TIMESTAMP not null,
      "updated_at" timestamptz default CURRENT_TIMESTAMP not null
    );
  `.execute(db)

  await sql`
    create table "session" (
      "id" uuid primary key default gen_random_uuid(),
      "expires_at" timestamptz not null,
      "token" text not null unique,
      "created_at" timestamptz default CURRENT_TIMESTAMP not null,
      "updated_at" timestamptz not null,
      "ip_address" text,
      "user_agent" text,
      "user_id" uuid not null references "user" ("id") on delete cascade
    );
  `.execute(db)

  await sql`
    create table "account" (
      "id" uuid primary key default gen_random_uuid(),
      "account_id" text not null,
      "provider_id" text not null,
      "user_id" uuid not null references "user" ("id") on delete cascade,
      "access_token" text,
      "refresh_token" text,
      "id_token" text,
      "access_token_expires_at" timestamptz,
      "refresh_token_expires_at" timestamptz,
      "scope" text,
      "password" text,
      "created_at" timestamptz default CURRENT_TIMESTAMP not null,
      "updated_at" timestamptz not null
    );
  `.execute(db)

  await sql`
    create table "verification" (
      "id" uuid primary key default gen_random_uuid(),
      "identifier" text not null,
      "value" text not null,
      "expires_at" timestamptz not null,
      "created_at" timestamptz default CURRENT_TIMESTAMP not null,
      "updated_at" timestamptz default CURRENT_TIMESTAMP not null
    );
  `.execute(db)

  await sql`create index "session_user_id_idx" on "session" ("user_id");`.execute(db)
  await sql`create index "account_user_id_idx" on "account" ("user_id");`.execute(db)
  await sql`create index "verification_identifier_idx" on "verification" ("identifier");`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table if exists "verification";`.execute(db)
  await sql`drop table if exists "account";`.execute(db)
  await sql`drop table if exists "session";`.execute(db)
  await sql`drop table if exists "user";`.execute(db)
}
