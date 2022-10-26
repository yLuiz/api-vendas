import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import IResponse from '../../../interfaces/IResponse'
import RedisCache from '@shared/cache/RedisCache';

export default class DeleteProductService {
  // The promise response could be 'void' instead of 'IResponse<Product>'
  public async execute(id: string): Promise<IResponse<Product | undefined>> {
    const productsRepository = getCustomRepository(ProductRepository);
    const redisCache = new RedisCache();

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError("Product was not found!", 404);
    }

    // For each product created, updated or deleted is nessary to delete the existing cache.
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    await productsRepository.remove(product);

    return {
      status: 200,
      message: "Product was deleted!",
      data: product
    }
  }
}