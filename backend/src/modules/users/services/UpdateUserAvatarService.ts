import IResponse from "@modules/interfaces/IResponse";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import path from "path";
import uploadConfig from "@cofing/upload";
import fs from 'fs';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: IRequest): Promise<IResponse<User>> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findById(userId);

    if(!user) {
      throw new AppError(`User ${userId} not found!`, 404);
    }

    if(user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if(userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return {
      status: 200,
      message: "Avatar Updated!",
      data: user
    }

  }
}