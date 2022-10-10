import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { paginate } from "typeorm-pagination/dist/helpers/pagination";
import IResponse from '../../../interfaces/IResponse';
import Customer from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: Customer[];
}

export default class ListCustomersService {
  public async execute(): Promise<IPaginateCustomer>{
    
    const customersRepository = getCustomRepository(CustomersRepository);
    const customers = await customersRepository.createQueryBuilder().paginate();

    if(!customers) {
      throw new AppError('There are no customers!', 404);
    }

    return customers as IPaginateCustomer;
  }
}