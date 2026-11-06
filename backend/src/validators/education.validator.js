import { assertRules, validate } from './validate.js';

export const EDUCATION_STATUSES = ['completed', 'in-progress'];

const educationSchema = {
  degree: { type: 'string', required: true, max: 80 },
  course: { type: 'string', required: true, max: 150 },
  institution: { type: 'string', required: true, max: 150 },
  startYear: { type: 'integer', min: 1950, max: 2100, nullable: true },
  endYear: { type: 'integer', min: 1950, max: 2100, nullable: true },
  status: { type: 'enum', required: true, values: EDUCATION_STATUSES },
  description: { type: 'string', max: 1000, nullable: true },
};

export const validateEducation = (body, options) => validate(educationSchema, body, options);

/** Regras entre campos, checadas sobre o registro completo (após mesclar um PATCH). */
export function assertEducationRules({ startYear, endYear, status }) {
  assertRules([
    startYear !== null && endYear !== null && endYear < startYear && {
      field: 'endYear',
      message: 'não pode ser anterior a startYear',
    },
    status === 'completed' && endYear === null && {
      field: 'endYear',
      message: 'é obrigatório quando status é "completed"',
    },
  ]);
}
