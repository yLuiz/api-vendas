import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import IResponse from '../../interfaces/IResponse';
import User from "../typeorm/entities/User";
import bcrypt from 'bcryptjs';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export default class UpdateUserService {
  public async execute({id, name, email, password, avatar}: IRequest): Promise<IResponse<User>> {
    const userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findById(id);
    if(!user) {
      throw new AppError(`User ${id} not found!`, 404);
    }
    
    if(user && user.name !== name) {
      throw new AppError("There is already someone with this name!");
    }

    if (user && user.email !== email) {
      throw new AppError("There is already someone with this email!");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.avatar = avatar ? avatar : user.avatar;

    await userRepository.save(user);

    const retorno: any = {...user, password: undefined};

    return {
      status: 200,
      message: 'User updated successfully',
      data: retorno
    }
  }
}