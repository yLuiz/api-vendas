import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import IResponse from '../../../interfaces/IResponse'
import RedisCache from '@shared/cache/RedisCache';

export default class ListProductService {
  public async execute(): Promise<IResponse<Product[]>> {
    const productsRepository = getCustomRepository(ProductRepository);
    const redisCache = new RedisCache();

    // Get products in cache.
    let products = await redisCache.recover<Product[]>('api-vendas-PRODUCT_LIST')

    if (!products) {
      products = await productsRepository.find();

      // If no products in cache, we will created a cache after the query in the database.
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return {
      status: 200,
      message: "Products listed!",
      data: products
    }
  }
}