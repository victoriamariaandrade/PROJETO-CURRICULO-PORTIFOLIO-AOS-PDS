import * as personService from '../services/person.service.js';
import * as service from '../services/skillCategory.service.js';
import { parseId } from '../utils/params.js';
import { modeFor } from '../validators/validate.js';
import { validateSkillCategory } from '../validators/skillCategory.validator.js';

export async function listByPerson(req, res) {
  const personId = await personService.resolvePersonId(req.params.person);
  res.json({ data: await service.listByPerson(personId) });
}

export async function get(req, res) {
  res.json({ data: await service.get(parseId(req.params.id)) });
}

export async function create(req, res) {
  const personId = await personService.resolvePersonId(req.params.person);
  const item = await service.create(personId, validateSkillCategory(req.body));
  res.status(201).location(`/api/skill-categories/${item.id}`).json({ data: item });
}

export async function update(req, res) {
  const id = parseId(req.params.id);
  const input = validateSkillCategory(req.body, modeFor(req));
  res.json({ data: await service.update(id, input) });
}

export async function remove(req, res) {
  await service.remove(parseId(req.params.id));
  res.status(204).end();
}
