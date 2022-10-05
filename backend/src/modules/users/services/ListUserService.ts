import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse';
import User from "../typeorm/entities/User";
import { UserRepository } from "../typeorm/repositories/UsersRepository";

export default class ListUserService {
  public async execute(): Promise<IResponse<User[]>>{
    
    const userRepository = getCustomRepository(UserRepository);
    const users = await userRepository.find();

    if(!users) {
      throw new AppError('There are no users!', 404);
    }

    return {
      status: 200,
      message: "Users Listed",
      data: users
    }
  }
}