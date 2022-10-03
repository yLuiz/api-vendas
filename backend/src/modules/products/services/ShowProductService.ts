import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import IResponse from '../../interfaces/IResponse'

interface IRequest {
  id: string
}

export default class ShowProductService {
  public async execute({ id }: IRequest): Promise<IResponse<Product | undefined>> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError("Product was not found!", 404);
    }

    return {
      status: 200,
      message: "Products listed!",
      data: product
    }
  }
}