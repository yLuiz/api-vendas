import productRouter from "@modules/products/routes/products.routes";
import passowordRouter from "@modules/users/routes/password.routes";
import sessionsRouter from "@modules/users/routes/sessions.routes";
import userRouter from "@modules/users/routes/user.routes";
import profileRouter from '@modules/users/routes/profile.routes';
import customerRouter from "@modules/customers/routes/customers.routes";
import { Router } from "express";
import orderRouter from "@modules/orders/routes/orders.routes";

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passowordRouter);
routes.use('/profile', profileRouter);
routes.use('/customers', customerRouter);
routes.use('/orders', orderRouter);

export default routes;