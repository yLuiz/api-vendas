import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import IResponse from '../../../interfaces/IResponse'
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}


export default class UpdateProductService {
  public async execute({ id, name, price, quantity }: IRequest): Promise<IResponse<Product | undefined>> {
    const productsRepository = getCustomRepository(ProductRepository);
    const redisCache = new RedisCache();

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError("Product was not found!", 404);
    }

    const productExists = await productsRepository.findByName(name);
    if (productExists && name !== product.name) {
      throw new AppError("There is already a product with this name!");
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    // For each product created, updated or deleted is nessary to delete the existing cache.
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    await productsRepository.save(product);


    return {
      status: 200,
      message: "Product was updated!",
      data: product
    }
  }
}