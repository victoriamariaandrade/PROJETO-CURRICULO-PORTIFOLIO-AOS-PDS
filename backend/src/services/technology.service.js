import * as technologyRepository from '../repositories/technology.repository.js';
import { HttpError, notFound } from '../utils/HttpError.js';

export const list = () => technologyRepository.findAll();

export async function get(id) {
  const item = await technologyRepository.findById(id);
  if (!item) throw notFound(`Tecnologia ${id} não encontrada.`);
  return item;
}

export const create = (input) => technologyRepository.create(input);

export async function update(id, input) {
  const updated = await technologyRepository.update(id, input);
  if (!updated) throw notFound(`Tecnologia ${id} não encontrada.`);
  return updated;
}

export async function remove(id) {
  try {
    if (!(await technologyRepository.remove(id))) throw notFound(`Tecnologia ${id} não encontrada.`);
  } catch (error) {
    // 23001 (ON DELETE RESTRICT): a tecnologia ainda está ligada a experiências, projetos ou habilidades.
    if (error.code === '23001' || error.code === '23503') {
      throw new HttpError(409, 'Tecnologia em uso: remova-a das experiências, projetos e habilidades antes de excluir.');
    }
    throw error;
  }
}
