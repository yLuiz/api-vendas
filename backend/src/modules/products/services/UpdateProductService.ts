import AppError from '@shared/errors/AppError';
import { ProductRepository } from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface IResponse<T> {
  status: number;
  message: string;
  data: T;
}

export default class UpdateProductService {
  public async execute({ id, name, price, quantity }: IRequest): Promise<IResponse<Product | undefined>> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError("Product was not found!", 404);
    }

    const productNameExists = await productsRepository.findByName(name);
    if (productNameExists && name !== productNameExists.name) {
      throw new AppError("There is already a product with this name!");
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return {
      status: 200,
      message: "Product was updated!",
      data: product
    }
  }
}