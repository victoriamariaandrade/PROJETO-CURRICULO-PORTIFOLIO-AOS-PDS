import { query } from '../config/database.js';

const COLUMNS = 'id, name, created_at AS "createdAt", updated_at AS "updatedAt"';

/** Tabelas de ligação N:N com tecnologias (nomes fixos, nunca vindos da requisição). */
export const TECHNOLOGY_LINKS = {
  experience: { table: 'experience_technologies', ownerColumn: 'experience_id' },
  project: { table: 'project_technologies', ownerColumn: 'project_id' },
  skillCategory: { table: 'skills', ownerColumn: 'category_id' },
};

/**
 * Subconsulta que devolve os nomes das tecnologias ligadas ao registro `alias.id`, na ordem salva.
 * Ex.: technologyNamesSql('experience', 'e') → JSON ["React", "Node.js"]
 */
export function technologyNamesSql(link, alias) {
  const { table, ownerColumn } = TECHNOLOGY_LINKS[link];
  return `COALESCE((
    SELECT json_agg(t.name ORDER BY l.position)
    FROM ${table} l
    JOIN technologies t ON t.id = l.technology_id
    WHERE l.${ownerColumn} = ${alias}.id
  ), '[]'::json)`;
}

export async function findAll() {
  const { rows } = await query(`
    SELECT t.id, t.name,
      (SELECT count(*) FROM experience_technologies WHERE technology_id = t.id)::int AS "experienceCount",
      (SELECT count(*) FROM project_technologies WHERE technology_id = t.id)::int AS "projectCount",
      (SELECT count(*) FROM skills WHERE technology_id = t.id)::int AS "skillCount"
    FROM technologies t
    ORDER BY lower(t.name)
  `);
  return rows;
}

export async function findById(id) {
  const { rows } = await query(`SELECT ${COLUMNS} FROM technologies WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function create({ name }) {
  const { rows } = await query(`INSERT INTO technologies (name) VALUES ($1) RETURNING ${COLUMNS}`, [name]);
  return rows[0];
}

export async function update(id, { name }) {
  const { rows } = await query(`UPDATE technologies SET name = $2 WHERE id = $1 RETURNING ${COLUMNS}`, [id, name]);
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM technologies WHERE id = $1', [id]);
  return rowCount > 0;
}

/**
 * Substitui as tecnologias ligadas a um registro, criando no catálogo as que ainda não existem.
 * Deve rodar dentro de uma transação (`client`).
 */
export async function replaceLinks(client, link, ownerId, names) {
  const { table, ownerColumn } = TECHNOLOGY_LINKS[link];

  await client.query(
    `INSERT INTO technologies (name)
     SELECT unnest($1::text[])
     ON CONFLICT ((lower(name))) DO NOTHING`,
    [names],
  );

  await client.query(`DELETE FROM ${table} WHERE ${ownerColumn} = $1`, [ownerId]);

  await client.query(
    `INSERT INTO ${table} (${ownerColumn}, technology_id, position)
     SELECT $1, t.id, n.position
     FROM unnest($2::text[]) WITH ORDINALITY AS n (name, position)
     JOIN technologies t ON lower(t.name) = lower(n.name)`,
    [ownerId, names],
  );
}
