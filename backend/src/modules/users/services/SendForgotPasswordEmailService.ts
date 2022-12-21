import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UsersRepository";
import { UserTokensRepository } from "../typeorm/repositories/UserTokensRepository";
import path from "path";
import EtherealMail from '@cofing/mail/EtherealMail';
import SESMail from '@cofing/mail/SESMail';
import mailConfig from '@cofing/mail/mail';

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

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: { 
          name: user.name, 
          email: user.email
        },
        subject: "[API Vendas] Recuperição de Senha",
        templateData: {
          file: forgotPasswordTemplate,
          variables: { 
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
            token
          }
        }
      })

      return;
    }

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
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          token
        }
      }
    })
  }
}