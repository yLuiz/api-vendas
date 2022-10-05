import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import IResponse from '../../../interfaces/IResponse';
import User from "../typeorm/entities/User";
import bcrypt from 'bcryptjs';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

export default class UpdateProfileService {
  public async execute({user_id, name, email, password, old_password }: IRequest): Promise<IResponse<User>> {
    const userRepository = getCustomRepository(UserRepository);

    let user = await userRepository.findById(user_id);
    if(!user) {
      throw new AppError(`User ${user_id} not found!`, 404);
    }

    const userEmail = await userRepository.findByEmail(email);
    if (userEmail && userEmail.id !== user_id) {
      throw new AppError("There is already someone with this email!");
    }

    if(password && !old_password) {
      throw new AppError('Old password is required!');
    }

    if(!password && old_password) {
      throw new AppError('Password is required!'); 
    }

    if(password && old_password) {
      const checkOldPassword = await bcrypt.compare(old_password, user.password);
      if(!checkOldPassword) {
        throw new AppError('Old password does not match!');
      }

      user.password = await bcrypt.hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await userRepository.save(user);

    const retorno: any = {...user, password: undefined};

    return {
      status: 200,
      message: 'User updated successfully',
      data: retorno
    }
  }
}