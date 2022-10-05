import AppError from "@shared/errors/AppError";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import { getCustomRepository} from "typeorm";
import User from "../typeorm/entities/User";
import IResponse from '../../../interfaces/IResponse'

interface IRequest {
  user_id: string;
}

export default class ShowProfileService {
  public async execute({ user_id }: IRequest): Promise<IResponse<User>>{
    
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findById(user_id);

    if(!user) {
      throw new AppError('User not found!', 404);
    }

    return {
      status: 200,
      message: "User Listed!",
      data: user
    }
  }
}