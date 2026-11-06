import { validate } from './validate.js';

const technologySchema = {
  name: { type: 'string', required: true, max: 60 },
};

export const validateTechnology = (body, options) => validate(technologySchema, body, options);
