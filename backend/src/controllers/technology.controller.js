import * as technologyService from '../services/technology.service.js';
import { parseId } from '../utils/params.js';
import { modeFor } from '../validators/validate.js';
import { validateTechnology } from '../validators/technology.validator.js';

export async function list(_req, res) {
  res.json({ data: await technologyService.list() });
}

export async function get(req, res) {
  res.json({ data: await technologyService.get(parseId(req.params.id)) });
}

export async function create(req, res) {
  const technology = await technologyService.create(validateTechnology(req.body));
  res.status(201).location(`/api/technologies/${technology.id}`).json({ data: technology });
}

export async function update(req, res) {
  const input = validateTechnology(req.body, modeFor(req));
  res.json({ data: await technologyService.update(parseId(req.params.id), input) });
}

export async function remove(req, res) {
  await technologyService.remove(parseId(req.params.id));
  res.status(204).end();
}
