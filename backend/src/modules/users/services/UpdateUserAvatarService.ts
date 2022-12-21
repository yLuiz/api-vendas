import IResponse from "src/interfaces/IResponse";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import path from "path";
import uploadConfig from "@cofing/upload";
import fs from 'fs';
import DiskStorageProvider from "@shared/providers/StorageProvider/DiskStorageProvider";


// Erro para atualizar avatar.

interface IRequest {
  userId: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: IRequest): Promise<IResponse<User>> {
    const userRepository = getCustomRepository(UserRepository);
    const storageProvider = new DiskStorageProvider();

    const user = await userRepository.findById(userId);

    if(!user) {
      throw new AppError(`User not found!`, 404);
    }

    if(user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const fileName = await storageProvider.saveFile(avatarFilename);
    user.avatar = fileName;

    await userRepository.save(user);

    return {
      status: 200,
      message: "Avatar Updated!",
      data: user
    }

  }
}