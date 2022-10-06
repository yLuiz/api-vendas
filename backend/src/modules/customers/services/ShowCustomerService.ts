import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse';
import Customer from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

interface IRequest {
  id: string;
}


export default class ShowCustomerService {
  public async execute({ id }: IRequest): Promise<IResponse<Customer>> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customer = await customersRepository.findOne(id);
    if(!customer) {
      throw new AppError(`Customer ${id} not found!`, 404);
    }
    
    return {
      status: 200,
      message: 'Customer listed successfully',
      data: customer
    }
  }
}