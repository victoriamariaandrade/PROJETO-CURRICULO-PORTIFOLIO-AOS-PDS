import { query } from '../config/database.js';

const COLUMNS = `
  id, person_id AS "personId", degree, course, institution,
  start_year AS "startYear", end_year AS "endYear", status, description,
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export async function findByPerson(personId) {
  // Em andamento primeiro; depois da mais recente para a mais antiga.
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM education
     WHERE person_id = $1
     ORDER BY end_year IS NULL DESC, end_year DESC, start_year DESC, id`,
    [personId],
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await query(`SELECT ${COLUMNS} FROM education WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function create(personId, item) {
  const { rows } = await query(
    `INSERT INTO education (person_id, degree, course, institution, start_year, end_year, status, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${COLUMNS}`,
    [personId, item.degree, item.course, item.institution, item.startYear, item.endYear, item.status, item.description],
  );
  return rows[0];
}

export async function update(id, item) {
  const { rows } = await query(
    `UPDATE education
     SET degree = $2, course = $3, institution = $4, start_year = $5, end_year = $6, status = $7, description = $8
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, item.degree, item.course, item.institution, item.startYear, item.endYear, item.status, item.description],
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM education WHERE id = $1', [id]);
  return rowCount > 0;
}
