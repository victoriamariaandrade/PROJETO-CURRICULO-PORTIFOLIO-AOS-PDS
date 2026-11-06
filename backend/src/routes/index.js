import { Router } from 'express';

import * as contactController from '../controllers/contact.controller.js';
import * as educationController from '../controllers/education.controller.js';
import * as experienceController from '../controllers/experience.controller.js';
import { health } from '../controllers/health.controller.js';
import * as projectController from '../controllers/project.controller.js';
import * as skillCategoryController from '../controllers/skillCategory.controller.js';
import personRoutes from './person.routes.js';
import { itemRoutes } from './resource.routes.js';
import technologyRoutes from './technology.routes.js';

const router = Router();

router.get('/health', health);
router.use('/people', personRoutes);
router.use('/contacts', itemRoutes(contactController));
router.use('/education', itemRoutes(educationController));
router.use('/experiences', itemRoutes(experienceController));
router.use('/projects', itemRoutes(projectController));
router.use('/skill-categories', itemRoutes(skillCategoryController));
router.use('/technologies', technologyRoutes);

export default router;
