import { query } from '../config/database.js';

const SUMMARY_COLUMNS = `
  p.id, p.slug, p.name, p.role, p.headline, p.location, p.avatar_url AS "avatarUrl"`;

const DETAIL_COLUMNS = `${SUMMARY_COLUMNS}, p.summary,
  p.created_at AS "createdAt", p.updated_at AS "updatedAt",
  COALESCE((
    SELECT json_agg(i.name ORDER BY i.display_order, i.id)
    FROM interests i
    WHERE i.person_id = p.id
  ), '[]'::json) AS interests,
  COALESCE((
    SELECT json_agg(json_build_object(
      'id', c.id, 'type', c.type, 'label', c.label, 'url', c.url, 'displayOrder', c.display_order
    ) ORDER BY c.display_order, c.id)
    FROM contacts c
    WHERE c.person_id = p.id
  ), '[]'::json) AS contacts`;

export async function findAll() {
  const { rows } = await query(`SELECT ${SUMMARY_COLUMNS} FROM people p ORDER BY p.name`);
  return rows;
}

export async function findById(id, db = { query }) {
  const { rows } = await db.query(`SELECT ${DETAIL_COLUMNS} FROM people p WHERE p.id = $1`, [id]);
  return rows[0] ?? null;
}

export async function findIdBySlug(slug) {
  const { rows } = await query('SELECT id FROM people WHERE slug = $1', [slug]);
  return rows[0]?.id ?? null;
}

export async function exists(id) {
  const { rowCount } = await query('SELECT 1 FROM people WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function insert(client, person) {
  const { rows } = await client.query(
    `INSERT INTO people (slug, name, role, headline, summary, location, avatar_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [person.slug, person.name, person.role, person.headline, person.summary, person.location, person.avatarUrl],
  );
  return rows[0].id;
}

export async function updateRow(client, id, person) {
  const { rowCount } = await client.query(
    `UPDATE people
     SET slug = $2, name = $3, role = $4, headline = $5, summary = $6, location = $7, avatar_url = $8
     WHERE id = $1`,
    [id, person.slug, person.name, person.role, person.headline, person.summary, person.location, person.avatarUrl],
  );
  return rowCount > 0;
}

/** Substitui a lista de interesses da pessoa, mantendo a ordem recebida. Roda dentro de uma transação. */
export async function replaceInterests(client, personId, names) {
  await client.query('DELETE FROM interests WHERE person_id = $1', [personId]);
  await client.query(
    `INSERT INTO interests (person_id, name, display_order)
     SELECT $1, n.name, n.position
     FROM unnest($2::text[]) WITH ORDINALITY AS n (name, position)`,
    [personId, names],
  );
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM people WHERE id = $1', [id]);
  return rowCount > 0;
}
