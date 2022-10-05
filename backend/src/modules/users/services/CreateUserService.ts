import AppError from "@shared/errors/AppError";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import User from "../typeorm/entities/User";
import { getCustomRepository } from "typeorm";
import IResponse from '../../../interfaces/IResponse'
import bcrypt from "bcryptjs";

interface IRequest {
  name: string;
  email: string;
  password: string;
}


export default class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<IResponse<User>> {
    const userRepository = getCustomRepository(UserRepository);

    const emailExists = await userRepository.findByEmail(email);
    if(emailExists) {
      throw new AppError("Email address already used!");
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await userRepository.save({
      name, 
      email,
      password: hashed
    })
    
    return {
      status: 201,
      message: 'User Created successfully',
      data: newUser
    }
  }
}