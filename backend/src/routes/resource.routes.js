import { Router } from 'express';

/** Rotas de um item pelo ID: GET, PUT (substitui), PATCH (parcial) e DELETE. */
export function itemRoutes(controller) {
  const router = Router();
  router
    .route('/:id')
    .get(controller.get)
    .put(controller.update)
    .patch(controller.update)
    .delete(controller.remove);
  return router;
}
