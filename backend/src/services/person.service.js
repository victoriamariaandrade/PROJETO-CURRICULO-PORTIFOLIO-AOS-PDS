import { withTransaction } from '../config/database.js';
import * as personRepository from '../repositories/person.repository.js';
import { notFound } from '../utils/HttpError.js';
import * as educationService from './education.service.js';
import * as experienceService from './experience.service.js';
import * as projectService from './project.service.js';
import * as skillCategoryService from './skillCategory.service.js';

const personNotFound = (ref) => notFound(`Pessoa "${ref}" não encontrada.`);

/**
 * Converte o parâmetro de rota (ID numérico ou slug) no ID da pessoa, ou lança 404.
 * Ex.: "1" ou "victoria-andrade".
 */
export async function resolvePersonId(ref) {
  const value = String(ref).trim().toLowerCase();
  const id = /^\d+$/.test(value)
    ? ((await personRepository.exists(Number(value))) ? Number(value) : null)
    : await personRepository.findIdBySlug(value);

  if (!id) throw personNotFound(ref);
  return id;
}

export const list = () => personRepository.findAll();

export async function get(ref) {
  return personRepository.findById(await resolvePersonId(ref));
}

/** Cria a pessoa e seus interesses na mesma transação. */
export function create(input) {
  return withTransaction(async (client) => {
    const id = await personRepository.insert(client, input);
    await personRepository.replaceInterests(client, id, input.interests);
    return personRepository.findById(id, client);
  });
}

/** Atualiza a pessoa; com PATCH, `input` traz só os campos enviados e o restante é mantido. */
export async function update(ref, input) {
  const current = await get(ref);
  const merged = { ...current, ...input };
  return withTransaction(async (client) => {
    await personRepository.updateRow(client, current.id, merged);
    await personRepository.replaceInterests(client, current.id, merged.interests);
    return personRepository.findById(current.id, client);
  });
}

export async function remove(ref) {
  const id = await resolvePersonId(ref);
  await personRepository.remove(id);
}

/** Currículo completo da pessoa em uma única resposta. */
export async function getResume(ref) {
  const id = await resolvePersonId(ref);
  const [profile, education, experiences, projects, skills] = await Promise.all([
    personRepository.findById(id),
    educationService.listByPerson(id),
    experienceService.listByPerson(id),
    projectService.listByPerson(id),
    skillCategoryService.listByPerson(id),
  ]);
  return { profile, education, experiences, projects, skills };
}
