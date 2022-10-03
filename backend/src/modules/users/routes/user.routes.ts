import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import UserController from '../controllers/UserController';

const userRouter = Router();
const UsersController = new UserController();

userRouter.get(
  '/',
  UsersController.index
);


userRouter.get(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  UsersController.show
);

userRouter.post(
  '/', 
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      avatar: Joi.string()
    }
  }),
  UsersController.create
);

userRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      avatar: Joi.string()
    }
  }),
  UsersController.update
);

userRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  UsersController.delete
);

export default userRouter;