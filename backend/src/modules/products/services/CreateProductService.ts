import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import IResponse from '../../interfaces/IResponse'

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

export default class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<IResponse<Product>> {
    const productsRepository = getCustomRepository(ProductRepository);

    const productExists = await productsRepository.findByName(name);
    if (productExists) {
      throw new AppError("There is already a product with this name!");
    }

    const newProduct = productsRepository.create({
      name,
      price,
      quantity
    });

    await productsRepository.save(newProduct);

    return {
      status: 201,
      message: "Product created!",
      data: newProduct
    }
  }
}