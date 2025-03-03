import { IresponseBase, ResponseBase } from '../../common/types/response-base.model';
import { CustomError } from '../../common/types/custom-error';
import { UserRepository } from '../../drivers/repositories/user.repository.impl';
import { IregisterData } from './entity/register-data.entity';
import { GeneralUtils } from '../../common/util/general.util';
import dotenv from 'dotenv';

dotenv.config();

export class RegisterUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(data: IregisterData): Promise<IresponseBase> {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) {
      throw new CustomError(
        { message: 'Ya hay un usuario con ese correo', code: 401 },
        'RegisterUseCase.execute',
        'Business',
      );
    }

    // Buscar al usuario por el correo electrónico
    data.password = await GeneralUtils.encryptPassword(data.password, process.env.PEPPER);

    return new ResponseBase({
      code: 'OK',
      message: 'La consulta se ejecuto con éxito',
      status: 201,
    });
  }
}
