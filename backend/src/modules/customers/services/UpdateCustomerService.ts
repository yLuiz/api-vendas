import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse';
import bcrypt from 'bcryptjs';
import Customer from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

interface IRequest {
  id: string;
  name: string;
  email: string;
}

export default class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<IResponse<Customer>> {
    const customersRepository = getCustomRepository(CustomersRepository);

    let customer = await customersRepository.findById(id);
    if(!customer) {
      throw new AppError(`Customer ${id} not found!`, 404);
    }

    const customerEmail = await customersRepository.findByEmail(email);
    if (customerEmail && customerEmail.id !== id) {
      throw new AppError("There is already someone with this email!");
    }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);

    const customerRetorno: any = {...customer, password: undefined};

    return {
      status: 200,
      message: 'customer updated successfully',
      data: customerRetorno
    }
  }
}