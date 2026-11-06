import { validate } from './validate.js';

export const CONTACT_TYPES = ['email', 'github', 'linkedin', 'website'];

const contactSchema = {
  type: { type: 'enum', required: true, values: CONTACT_TYPES },
  label: { type: 'string', required: true, max: 200 },
  url: { type: 'url', required: true, max: 500 },
  displayOrder: { type: 'integer', min: 0, max: 1000, default: 0 },
};

export const validateContact = (body, options) => validate(contactSchema, body, options);
