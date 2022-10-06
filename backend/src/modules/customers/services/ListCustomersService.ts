import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse';
import Customer from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

export default class ListCustomersService {
  public async execute(): Promise<IResponse<Customer[]>>{
    
    const customersRepository = getCustomRepository(CustomersRepository);
    const customers = await customersRepository.find();

    if(!customers) {
      throw new AppError('There are no customers!', 404);
    }

    return {
      status: 200,
      message: "Customers Listed",
      data: customers
    }
  }
}