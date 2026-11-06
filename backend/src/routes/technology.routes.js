import { Router } from 'express';

import * as technologyController from '../controllers/technology.controller.js';

const router = Router();

router.route('/').get(technologyController.list).post(technologyController.create);

router
  .route('/:id')
  .get(technologyController.get)
  .put(technologyController.update)
  .patch(technologyController.update)
  .delete(technologyController.remove);

export default router;
