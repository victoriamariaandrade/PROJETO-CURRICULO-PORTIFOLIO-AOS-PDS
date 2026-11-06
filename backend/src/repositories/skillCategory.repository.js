import { query } from '../config/database.js';

// Cada habilidade é uma tecnologia do catálogo ligada à categoria (tabela skills).
const COLUMNS = `
  c.id, c.person_id AS "personId", c.name, c.icon, c.display_order AS "displayOrder",
  COALESCE((
    SELECT json_agg(json_build_object('id', s.id, 'technologyId', t.id, 'name', t.name) ORDER BY s.position)
    FROM skills s
    JOIN technologies t ON t.id = s.technology_id
    WHERE s.category_id = c.id
  ), '[]'::json) AS skills,
  c.created_at AS "createdAt", c.updated_at AS "updatedAt"`;

export async function findByPerson(personId) {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM skill_categories c WHERE c.person_id = $1 ORDER BY c.display_order, c.id`,
    [personId],
  );
  return rows;
}

export async function findById(id, db = { query }) {
  const { rows } = await db.query(`SELECT ${COLUMNS} FROM skill_categories c WHERE c.id = $1`, [id]);
  return rows[0] ?? null;
}

export async function insert(client, personId, item) {
  const { rows } = await client.query(
    `INSERT INTO skill_categories (person_id, name, icon, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [personId, item.name, item.icon, item.displayOrder],
  );
  return rows[0].id;
}

export async function updateRow(client, id, item) {
  const { rowCount } = await client.query(
    'UPDATE skill_categories SET name = $2, icon = $3, display_order = $4 WHERE id = $1',
    [id, item.name, item.icon, item.displayOrder],
  );
  return rowCount > 0;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM skill_categories WHERE id = $1', [id]);
  return rowCount > 0;
}
