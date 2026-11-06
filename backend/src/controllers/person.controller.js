import * as personService from '../services/person.service.js';
import { modeFor } from '../validators/validate.js';
import { validatePerson } from '../validators/person.validator.js';

export async function list(_req, res) {
  res.json({ data: await personService.list() });
}

export async function get(req, res) {
  res.json({ data: await personService.get(req.params.person) });
}

export async function getResume(req, res) {
  res.json({ data: await personService.getResume(req.params.person) });
}

export async function create(req, res) {
  const person = await personService.create(validatePerson(req.body));
  res.status(201).location(`/api/people/${person.id}`).json({ data: person });
}

export async function update(req, res) {
  const input = validatePerson(req.body, modeFor(req));
  res.json({ data: await personService.update(req.params.person, input) });
}

export async function remove(req, res) {
  await personService.remove(req.params.person);
  res.status(204).end();
}
