import AppError from '@shared/errors/AppError';
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';

interface IRequest {
  id: string;
}

export default class ShowOrderService {
  public async execute({ id }: IRequest): Promise<IResponse<Order>> {
    const ordersRepository = getCustomRepository(OrdersRepository);

    const order = await ordersRepository.findById(id)
    if(!order) {
      throw new AppError('Order not found!', 404);
    }

    return {
      status: 200,
      message: 'Order listed!',
      data: order
    }
  }
}