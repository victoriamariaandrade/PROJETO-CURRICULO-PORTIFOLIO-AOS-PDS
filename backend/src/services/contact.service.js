import * as contactRepository from '../repositories/contact.repository.js';
import { notFound } from '../utils/HttpError.js';

export const listByPerson = (personId) => contactRepository.findByPerson(personId);

export async function get(id) {
  const contact = await contactRepository.findById(id);
  if (!contact) throw notFound(`Contato ${id} não encontrado.`);
  return contact;
}

export const create = (personId, input) => contactRepository.create(personId, input);

export async function update(id, input) {
  const current = await get(id);
  return contactRepository.update(id, { ...current, ...input });
}

export async function remove(id) {
  if (!(await contactRepository.remove(id))) throw notFound(`Contato ${id} não encontrado.`);
}
