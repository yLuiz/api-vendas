import AppError from '@shared/errors/AppError';
import { getCustomRepository } from "typeorm";
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';
import Order from '../typeorm/entities/Order';
import IResponse from '../../../interfaces/IResponse'
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

export default class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<IResponse<Order>> {
    try {
      const ordersRepository = getCustomRepository(OrdersRepository);
      const customersRepository = getCustomRepository(CustomersRepository);
      const productsRepository = getCustomRepository(ProductRepository);

      const customerExists = await customersRepository.findById(customer_id)
      if(!customerExists) {
        throw new AppError('Could not find customer with the given id!', 404);
      }

      const existsProducts = await productsRepository.findAllByIds(products)

      if(!existsProducts.length) {
        throw new AppError('Could not find products with the given ids!', 404);
      }

      const existsProductsIds = existsProducts.map(product => product.id);
      const checkInexistentProducts = products.filter(product => !existsProductsIds.includes(product.id));

      if(checkInexistentProducts.length) {
        throw new AppError(`Could not find product ${checkInexistentProducts[0].id}!`);
      }

      const quantityAvailable = products.filter(product => {
        return existsProducts.filter(p => p.id === product.id)[0].quantity < product.quantity;
      });

      if (quantityAvailable.length) {
        throw new AppError(
          `The quantity of ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`
        );
      }

      const serializedProducts = products.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        price: existsProducts.filter(p => p.id === product.id)[0].price
      }))

      const order = await ordersRepository.createOrder({
        customer: customerExists, 
        products: serializedProducts
      });

      const { order_products } = order; 

      const updatedProductQuantity = order_products.map(
        product => ({
          id: product.product_id,
          quantity: existsProducts.filter(p => p.id === product.product_id)[0].quantity - product.quantity
        })
      )

      await productsRepository.save(updatedProductQuantity);

      return {
        status: 201,
        message: 'Order created!',
        data: order
      }
   } catch(err: any) {
    console.log(err);
    if(err.statusCode) {
      throw new AppError(err.message, err.statusCode);
    }
    throw new AppError(`Internal Error: ${err}`, 500);
   }
  }
}