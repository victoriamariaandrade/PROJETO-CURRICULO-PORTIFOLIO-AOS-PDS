import { withTransaction } from '../config/database.js';
import * as experienceRepository from '../repositories/experience.repository.js';
import { replaceLinks } from '../repositories/technology.repository.js';
import { notFound } from '../utils/HttpError.js';
import { assertExperienceRules } from '../validators/experience.validator.js';

export const listByPerson = (personId) => experienceRepository.findByPerson(personId);

export async function get(id) {
  const item = await experienceRepository.findById(id);
  if (!item) throw notFound(`Experiência ${id} não encontrada.`);
  return item;
}

/** Cria a experiência e liga as tecnologias (criando no catálogo as novas) na mesma transação. */
export function create(personId, input) {
  assertExperienceRules(input);
  return withTransaction(async (client) => {
    const id = await experienceRepository.insert(client, personId, input);
    await replaceLinks(client, 'experience', id, input.technologies);
    return experienceRepository.findById(id, client);
  });
}

export async function update(id, input) {
  const merged = { ...(await get(id)), ...input };
  assertExperienceRules(merged);
  return withTransaction(async (client) => {
    await experienceRepository.updateRow(client, id, merged);
    await replaceLinks(client, 'experience', id, merged.technologies);
    return experienceRepository.findById(id, client);
  });
}

export async function remove(id) {
  if (!(await experienceRepository.remove(id))) throw notFound(`Experiência ${id} não encontrada.`);
}
