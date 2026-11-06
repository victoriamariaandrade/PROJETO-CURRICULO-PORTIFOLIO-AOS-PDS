import { query } from '../config/database.js';

const COLUMNS = `
  id, person_id AS "personId", type, label, url, display_order AS "displayOrder",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export async function findByPerson(personId) {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM contacts WHERE person_id = $1 ORDER BY display_order, id`,
    [personId],
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await query(`SELECT ${COLUMNS} FROM contacts WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function create(personId, contact) {
  const { rows } = await query(
    `INSERT INTO contacts (person_id, type, label, url, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNS}`,
    [personId, contact.type, contact.label, contact.url, contact.displayOrder],
  );
  return rows[0];
}

export async function update(id, contact) {
  const { rows } = await query(
    `UPDATE contacts SET type = $2, label = $3, url = $4, display_order = $5
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, contact.type, contact.label, contact.url, contact.displayOrder],
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM contacts WHERE id = $1', [id]);
  return rowCount > 0;
}
