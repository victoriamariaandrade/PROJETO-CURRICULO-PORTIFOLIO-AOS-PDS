import { withTransaction } from '../config/database.js';
import * as skillCategoryRepository from '../repositories/skillCategory.repository.js';
import { replaceLinks } from '../repositories/technology.repository.js';
import { notFound } from '../utils/HttpError.js';

export const listByPerson = (personId) => skillCategoryRepository.findByPerson(personId);

export async function get(id) {
  const item = await skillCategoryRepository.findById(id);
  if (!item) throw notFound(`Categoria de habilidades ${id} não encontrada.`);
  return item;
}

/** `input.skills` é a lista de nomes de tecnologias, na ordem de exibição. */
export function create(personId, input) {
  return withTransaction(async (client) => {
    const id = await skillCategoryRepository.insert(client, personId, input);
    await replaceLinks(client, 'skillCategory', id, input.skills);
    return skillCategoryRepository.findById(id, client);
  });
}

export async function update(id, input) {
  const current = await get(id);
  const merged = { ...current, skills: current.skills.map((skill) => skill.name), ...input };
  return withTransaction(async (client) => {
    await skillCategoryRepository.updateRow(client, id, merged);
    await replaceLinks(client, 'skillCategory', id, merged.skills);
    return skillCategoryRepository.findById(id, client);
  });
}

export async function remove(id) {
  if (!(await skillCategoryRepository.remove(id))) {
    throw notFound(`Categoria de habilidades ${id} não encontrada.`);
  }
}
