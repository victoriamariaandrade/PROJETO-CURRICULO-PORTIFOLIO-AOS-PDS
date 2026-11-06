import { validate } from './validate.js';

const projectSchema = {
  name: { type: 'string', required: true, max: 120 },
  description: { type: 'string', required: true, max: 2000 },
  category: { type: 'string', max: 80, nullable: true },
  partner: { type: 'string', max: 120, nullable: true },
  icon: { type: 'string', max: 60, nullable: true },
  repositoryUrl: { type: 'url', max: 500, nullable: true },
  technologies: { type: 'stringArray', itemMax: 60, maxItems: 30, default: [] },
  displayOrder: { type: 'integer', min: 0, max: 1000, default: 0 },
};

export const validateProject = (body, options) => validate(projectSchema, body, options);
