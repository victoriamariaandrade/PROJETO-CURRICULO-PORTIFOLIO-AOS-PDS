import { assertRules, validate } from './validate.js';

const experienceSchema = {
  role: { type: 'string', required: true, max: 120 },
  company: { type: 'string', required: true, max: 120 },
  startDate: { type: 'date', required: true },
  endDate: { type: 'date', nullable: true },
  description: { type: 'string', required: true, max: 2000 },
  technologies: { type: 'stringArray', itemMax: 60, maxItems: 30, default: [] },
};

export const validateExperience = (body, options) => validate(experienceSchema, body, options);

export function assertExperienceRules({ startDate, endDate }) {
  assertRules([
    endDate !== null && endDate < startDate && {
      field: 'endDate',
      message: 'não pode ser anterior a startDate',
    },
  ]);
}
