import { query } from '../config/database.js';
import { technologyNamesSql } from './technology.repository.js';

const COLUMNS = `
  e.id, e.person_id AS "personId", e.role, e.company,
  e.start_date AS "startDate", e.end_date AS "endDate", e.description,
  ${technologyNamesSql('experience', 'e')} AS technologies,
  e.created_at AS "createdAt", e.updated_at AS "updatedAt"`;

export async function findByPerson(personId) {
  // Emprego atual primeiro; depois do mais recente para o mais antigo.
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM experiences e
     WHERE e.person_id = $1
     ORDER BY e.end_date IS NULL DESC, e.start_date DESC, e.id`,
    [personId],
  );
  return rows;
}

export async function findById(id, db = { query }) {
  const { rows } = await db.query(`SELECT ${COLUMNS} FROM experiences e WHERE e.id = $1`, [id]);
  return rows[0] ?? null;
}

export async function insert(client, personId, item) {
  const { rows } = await client.query(
    `INSERT INTO experiences (person_id, role, company, start_date, end_date, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [personId, item.role, item.company, item.startDate, item.endDate, item.description],
  );
  return rows[0].id;
}

export async function updateRow(client, id, item) {
  const { rowCount } = await client.query(
    `UPDATE experiences
     SET role = $2, company = $3, start_date = $4, end_date = $5, description = $6
     WHERE id = $1`,
    [id, item.role, item.company, item.startDate, item.endDate, item.description],
  );
  return rowCount > 0;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM experiences WHERE id = $1', [id]);
  return rowCount > 0;
}
