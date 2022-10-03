import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import SessionController from '../controllers/SessionController';

const sessionsRouter = Router();
const SessionsController = new SessionController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  SessionsController.createSessions
);

export default sessionsRouter;