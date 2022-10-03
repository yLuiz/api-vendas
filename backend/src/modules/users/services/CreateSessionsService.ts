import AppError from "@shared/errors/AppError";
import bcrypt from "bcryptjs";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UserRepository } from "../typeorm/repositories/UsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface ITokenResponse {
  user: User;
  token: string;
}


export default class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<User> {
    
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findByEmail(email);
    if(!user) {
      throw new AppError("Incorrect Credentials!", 401);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password); 
    if(!isCorrectPassword) {
      throw new AppError("Incorrect Credentials!", 401);
    }

    const userRetorno: any = { ...user, password: undefined };
    
    return userRetorno;
  }
}