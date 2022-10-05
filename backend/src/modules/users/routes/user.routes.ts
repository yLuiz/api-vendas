import uploadConfig from '@cofing/upload';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import UserController from '../controllers/UserController';

const userRouter = Router();
const usersController = new UserController();
const usersAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

userRouter.get(
  '/',
  isAuthenticated,
  usersController.index
);


userRouter.get(
  '/:id', 
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  isAuthenticated,
  usersController.show
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
  usersController.create
);

userRouter.patch(
  '/avatar', 
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update
)

userRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  usersController.delete
);

export default userRouter;