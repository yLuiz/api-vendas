import AppError from "@shared/errors/AppError";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";
import Customer from "../typeorm/entities/Customer";
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse'
import bcrypt from "bcryptjs";

interface IRequest {
  name: string;
  email: string;
}


export default class CreateCustomerService {
  public async execute({ name, email }: IRequest): Promise<IResponse<Customer>> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const emailExists = await customersRepository.findByEmail(email);
    if(emailExists) {
      throw new AppError("Email address already used!");
    }

    const customer = customersRepository.create({
      name, 
      email
    })

    await customersRepository.save(customer);
    
    return {
      status: 201,
      message: 'Customer Created successfully',
      data: customer
    }
  }
}