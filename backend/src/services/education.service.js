import * as educationRepository from '../repositories/education.repository.js';
import { notFound } from '../utils/HttpError.js';
import { assertEducationRules } from '../validators/education.validator.js';

export const listByPerson = (personId) => educationRepository.findByPerson(personId);

export async function get(id) {
  const item = await educationRepository.findById(id);
  if (!item) throw notFound(`Formação ${id} não encontrada.`);
  return item;
}

export function create(personId, input) {
  assertEducationRules(input);
  return educationRepository.create(personId, input);
}

export async function update(id, input) {
  const merged = { ...(await get(id)), ...input };
  assertEducationRules(merged);
  return educationRepository.update(id, merged);
}

export async function remove(id) {
  if (!(await educationRepository.remove(id))) throw notFound(`Formação ${id} não encontrada.`);
}
