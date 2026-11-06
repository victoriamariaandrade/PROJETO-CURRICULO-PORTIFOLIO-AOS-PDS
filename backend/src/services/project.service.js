import { withTransaction } from '../config/database.js';
import * as projectRepository from '../repositories/project.repository.js';
import { replaceLinks } from '../repositories/technology.repository.js';
import { notFound } from '../utils/HttpError.js';

export const listByPerson = (personId) => projectRepository.findByPerson(personId);

export async function get(id) {
  const item = await projectRepository.findById(id);
  if (!item) throw notFound(`Projeto ${id} não encontrado.`);
  return item;
}

export function create(personId, input) {
  return withTransaction(async (client) => {
    const id = await projectRepository.insert(client, personId, input);
    await replaceLinks(client, 'project', id, input.technologies);
    return projectRepository.findById(id, client);
  });
}

export async function update(id, input) {
  const merged = { ...(await get(id)), ...input };
  return withTransaction(async (client) => {
    await projectRepository.updateRow(client, id, merged);
    await replaceLinks(client, 'project', id, merged.technologies);
    return projectRepository.findById(id, client);
  });
}

export async function remove(id) {
  if (!(await projectRepository.remove(id))) throw notFound(`Projeto ${id} não encontrado.`);
}
