import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import IResponse from '../../../interfaces/IResponse'

export default class ListProductService {
  public async execute(): Promise<IResponse<Product[]>> {
    const productsRepository = getCustomRepository(ProductRepository);

    const products = await productsRepository.find();
    if (!products) {
      throw new AppError("There are not products!", 404);
    }

    return {
      status: 200,
      message: "Products listed!",
      data: products
    }
  }
}