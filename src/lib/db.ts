import { Pool, types, type QueryResultRow } from "pg";

// "timestamp without time zone" columns hold UTC; parse them as UTC, not local time.
types.setTypeParser(1114, (value) => new Date(value.replace(" ", "T") + "Z"));

const globalForPg = globalThis as unknown as { pgPool: Pool | undefined };

export const pool = globalForPg.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

/** Run a parameterised SQL statement and return its rows. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

/** Parse a numeric route id; returns null when it isn't a whole number. */
export function parseId(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

/**
 * Build and run `UPDATE table SET col = $n, ... WHERE idColumn = $id RETURNING returning`.
 * Only the columns present in `fields` (value !== undefined) are updated.
 * Table and column names come from the calling code, never from user input.
 */
export async function updateById<T extends QueryResultRow>(
  table: string,
  idColumn: string,
  id: number,
  fields: Record<string, unknown>,
  returning: string
): Promise<T | null> {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);

  if (entries.length === 0) {
    const rows = await query<T>(`SELECT ${returning} FROM ${table} WHERE ${idColumn} = $1`, [id]);
    return rows[0] ?? null;
  }

  const sets = entries.map(([col], i) => `${col} = $${i + 1}`).join(", ");
  const values = entries.map(([, v]) => v);
  const rows = await query<T>(
    `UPDATE ${table} SET ${sets} WHERE ${idColumn} = $${entries.length + 1} RETURNING ${returning}`,
    [...values, id]
  );
  return rows[0] ?? null;
}

/** Postgres error code of a thrown driver error (e.g. "23503" = foreign key violation). */
export function pgErrorCode(error: unknown): string | undefined {
  return (error as { code?: string })?.code;
}
