import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import IResponse from '../../../interfaces/IResponse';
import User from "../typeorm/entities/User";

export default class DeleteUserService {
  public async execute(id: string): Promise<IResponse<User>> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne(id);
    if(!user) {
      throw new AppError(`User ${id} not found!`, 404);
    }

    await userRepository.delete(id);

    return {
      status: 200,
      message: 'User deleted successfully',
      data: user
    }
  }
}