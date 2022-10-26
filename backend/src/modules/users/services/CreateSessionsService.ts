import AppError from "@shared/errors/AppError";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import authConfig from '@cofing/auth';

interface IRequest {
  email: string;
  password: string;
}

interface ITokenResponse {
  user: User;
  token: string;
}


export default class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<ITokenResponse> {
    
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
    const secretKey: any = authConfig.jwt.secretKey;


    const token = sign({}, secretKey, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn
    });
    
    return {
      user: userRetorno,
      token
    };
  }
}