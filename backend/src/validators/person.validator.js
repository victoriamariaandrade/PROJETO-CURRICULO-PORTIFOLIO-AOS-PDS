import { validate } from './validate.js';

const personSchema = {
  slug: { type: 'slug', required: true, max: 80 },
  name: { type: 'string', required: true, max: 120 },
  role: { type: 'string', required: true, max: 120 },
  headline: { type: 'string', max: 200, nullable: true },
  summary: { type: 'string', required: true, max: 2000 },
  location: { type: 'string', max: 120, nullable: true },
  avatarUrl: { type: 'url', max: 500, nullable: true },
  /** Áreas de interesse, na ordem de exibição. */
  interests: { type: 'stringArray', itemMax: 80, maxItems: 20, default: [] },
};

export const validatePerson = (body, options) => validate(personSchema, body, options);
