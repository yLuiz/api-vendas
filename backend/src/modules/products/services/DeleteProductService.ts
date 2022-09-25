import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';

interface IResponse<T> {
  status: number;
  message: string;
  data: T;
}

export default class DeleteProductService {
  // The promise response could be 'void' instead of 'IResponse<Product>'
  public async execute(id: string): Promise<IResponse<Product | undefined>> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError("Product was not found!", 404);
    }

    await productsRepository.remove(product);

    return {
      status: 200,
      message: "Product was deleted!",
      data: product
    }
  }
}