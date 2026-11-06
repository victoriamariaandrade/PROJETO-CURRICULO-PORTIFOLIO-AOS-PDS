import { Router } from 'express';

import * as contactController from '../controllers/contact.controller.js';
import * as educationController from '../controllers/education.controller.js';
import * as experienceController from '../controllers/experience.controller.js';
import * as personController from '../controllers/person.controller.js';
import * as projectController from '../controllers/project.controller.js';
import * as skillCategoryController from '../controllers/skillCategory.controller.js';

// `:person` aceita o ID numérico ou o slug (ex.: /api/people/victoria-andrade).
const router = Router();

router.route('/').get(personController.list).post(personController.create);

router
  .route('/:person')
  .get(personController.get)
  .put(personController.update)
  .patch(personController.update)
  .delete(personController.remove);

router.get('/:person/resume', personController.getResume);

// Recursos de uma pessoa: listagem e criação ficam aninhadas.
const nested = {
  contacts: contactController,
  education: educationController,
  experiences: experienceController,
  projects: projectController,
  'skill-categories': skillCategoryController,
};

for (const [path, controller] of Object.entries(nested)) {
  router.route(`/:person/${path}`).get(controller.listByPerson).post(controller.create);
}

export default router;
