import { validate } from './validate.js';

const skillCategorySchema = {
  name: { type: 'string', required: true, max: 80 },
  icon: { type: 'string', max: 60, nullable: true },
  /** Nomes das tecnologias da categoria, na ordem de exibição. */
  skills: { type: 'stringArray', itemMax: 60, maxItems: 50, default: [] },
  displayOrder: { type: 'integer', min: 0, max: 1000, default: 0 },
};

export const validateSkillCategory = (body, options) => validate(skillCategorySchema, body, options);
