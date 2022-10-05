import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import { UserTokensRepository } from "../typeorm/repositories/UserTokensRepository";
import EtherealMail from '@cofing/mail/EtherealMail';
import path from "path";

interface IRequest {
  email: string;
}

export default class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const user = await userRepository.findByEmail(email);
    if(!user) {
      throw new AppError('User not found!', 404);
    }
    
    const { token } = await userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    // console.log(token);

    await EtherealMail.sendMail({
      to: { 
        name: user.name, 
        email: user.email
      },
      subject: "[API Vendas] Recuperição de Senha",
      templateData: {
        file: forgotPasswordTemplate,
        variables: { 
          name: user.name,
          link: `http://localhost:3030/reset_password?token=${token}`,
          token
        }
      }
    })
  }
}