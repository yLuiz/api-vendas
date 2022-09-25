import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const productRouter = Router();
const productsController = new ProductController();

productRouter.get('/', productsController.index);
productRouter.get('/:id', productsController.show);
productRouter.post('/', productsController.create);
productRouter.put('/:id', productsController.update);
productRouter.delete('/:id', productsController.delete);

export default productRouter;