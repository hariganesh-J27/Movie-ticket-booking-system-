import { randomUUID } from "node:crypto";
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import { query } from "@/lib/db";

// Auth.js database adapter written in plain SQL against the users / accounts /
// sessions / verification_tokens tables (see db/schema.sql).

const USER_COLS = `id, name, email, email_verified AS "emailVerified", image`;
const SESSION_COLS = `session_token AS "sessionToken", user_id AS "userId", expires`;

// ISO strings keep "timestamp without time zone" columns in UTC.
const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

export function PgAdapter(): Adapter {
  return {
    async createUser(user) {
      const rows = await query<AdapterUser>(
        `INSERT INTO users (id, name, email, email_verified, image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING ${USER_COLS}`,
        [randomUUID(), user.name ?? null, user.email, iso(user.emailVerified), user.image ?? null]
      );
      return rows[0];
    },

    async getUser(id) {
      const rows = await query<AdapterUser>(`SELECT ${USER_COLS} FROM users WHERE id = $1`, [id]);
      return rows[0] ?? null;
    },

    async getUserByEmail(email) {
      const rows = await query<AdapterUser>(`SELECT ${USER_COLS} FROM users WHERE email = $1`, [email]);
      return rows[0] ?? null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const rows = await query<AdapterUser>(
        `SELECT u.id, u.name, u.email, u.email_verified AS "emailVerified", u.image
         FROM users u
         JOIN accounts a ON a.user_id = u.id
         WHERE a.provider = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId]
      );
      return rows[0] ?? null;
    },

    async updateUser(user) {
      const rows = await query<AdapterUser>(
        `UPDATE users
         SET name           = COALESCE($2, name),
             email          = COALESCE($3, email),
             email_verified = COALESCE($4, email_verified),
             image          = COALESCE($5, image)
         WHERE id = $1
         RETURNING ${USER_COLS}`,
        [user.id, user.name ?? null, user.email ?? null, iso(user.emailVerified), user.image ?? null]
      );
      return rows[0];
    },

    async deleteUser(id) {
      await query(`DELETE FROM users WHERE id = $1`, [id]);
    },

    async linkAccount(account: AdapterAccount) {
      await query(
        `INSERT INTO accounts (user_id, type, provider, provider_account_id, refresh_token, access_token,
                               expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token ?? null,
          account.access_token ?? null,
          account.expires_at ?? null,
          account.token_type ?? null,
          account.scope ?? null,
          account.id_token ?? null,
          (account.session_state as string | undefined) ?? null,
        ]
      );
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await query(`DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2`, [
        provider,
        providerAccountId,
      ]);
    },

    async createSession({ sessionToken, userId, expires }) {
      const rows = await query<AdapterSession>(
        `INSERT INTO sessions (session_token, user_id, expires)
         VALUES ($1, $2, $3)
         RETURNING ${SESSION_COLS}`,
        [sessionToken, userId, iso(expires)]
      );
      return rows[0];
    },

    async getSessionAndUser(sessionToken) {
      const rows = await query<{
        sessionToken: string;
        userId: string;
        expires: Date;
        uid: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
      }>(
        `SELECT s.session_token AS "sessionToken", s.user_id AS "userId", s.expires,
                u.id AS uid, u.name, u.email, u.email_verified AS "emailVerified", u.image
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.session_token = $1`,
        [sessionToken]
      );
      const r = rows[0];
      if (!r) return null;
      return {
        session: { sessionToken: r.sessionToken, userId: r.userId, expires: r.expires },
        user: { id: r.uid, name: r.name, email: r.email, emailVerified: r.emailVerified, image: r.image },
      };
    },

    async updateSession({ sessionToken, expires }) {
      const rows = await query<AdapterSession>(
        `UPDATE sessions SET expires = COALESCE($2, expires)
         WHERE session_token = $1
         RETURNING ${SESSION_COLS}`,
        [sessionToken, iso(expires)]
      );
      return rows[0] ?? null;
    },

    async deleteSession(sessionToken) {
      await query(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken]);
    },

    async createVerificationToken({ identifier, token, expires }) {
      const rows = await query<VerificationToken>(
        `INSERT INTO verification_tokens (identifier, token, expires)
         VALUES ($1, $2, $3)
         RETURNING identifier, token, expires`,
        [identifier, token, iso(expires)]
      );
      return rows[0];
    },

    async useVerificationToken({ identifier, token }) {
      const rows = await query<VerificationToken>(
        `DELETE FROM verification_tokens
         WHERE identifier = $1 AND token = $2
         RETURNING identifier, token, expires`,
        [identifier, token]
      );
      return rows[0] ?? null;
    },
  };
}
