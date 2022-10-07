import { Router } from 'express';
import OrdersController from '../controller/OrdersController';
import {celebrate, Joi, Segments} from 'celebrate';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const orderRouter = Router();
const ordersController = new OrdersController();

orderRouter.use(isAuthenticated);

orderRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  ordersController.show
);

orderRouter.post(
  '/', 
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().required(),
      products: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().required(),
      }).required()),
    }
  }),
  ordersController.create
);


export default orderRouter;