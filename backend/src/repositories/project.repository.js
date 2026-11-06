import { query } from '../config/database.js';
import { technologyNamesSql } from './technology.repository.js';

const COLUMNS = `
  p.id, p.person_id AS "personId", p.name, p.description, p.category, p.partner, p.icon,
  p.repository_url AS "repositoryUrl", p.display_order AS "displayOrder",
  ${technologyNamesSql('project', 'p')} AS technologies,
  p.created_at AS "createdAt", p.updated_at AS "updatedAt"`;

export async function findByPerson(personId) {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM projects p WHERE p.person_id = $1 ORDER BY p.display_order, p.id`,
    [personId],
  );
  return rows;
}

export async function findById(id, db = { query }) {
  const { rows } = await db.query(`SELECT ${COLUMNS} FROM projects p WHERE p.id = $1`, [id]);
  return rows[0] ?? null;
}

export async function insert(client, personId, item) {
  const { rows } = await client.query(
    `INSERT INTO projects (person_id, name, description, category, partner, icon, repository_url, display_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [personId, item.name, item.description, item.category, item.partner, item.icon, item.repositoryUrl, item.displayOrder],
  );
  return rows[0].id;
}

export async function updateRow(client, id, item) {
  const { rowCount } = await client.query(
    `UPDATE projects
     SET name = $2, description = $3, category = $4, partner = $5, icon = $6, repository_url = $7, display_order = $8
     WHERE id = $1`,
    [id, item.name, item.description, item.category, item.partner, item.icon, item.repositoryUrl, item.displayOrder],
  );
  return rowCount > 0;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM projects WHERE id = $1', [id]);
  return rowCount > 0;
}
