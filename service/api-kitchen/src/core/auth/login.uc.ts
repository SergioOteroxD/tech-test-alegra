import { CustomError } from '../../common/types/custom-error';
import { JwtManager } from '../../drivers/jwt-manager';
import { UserRepository } from '../../drivers/repositories/user.repository.impl';
import { IresponseBase, ResponseBase } from '../../common/types/response-base.model';
import { GeneralUtils } from '../../common/util/general.util';
import dotenv from 'dotenv';

dotenv.config();

export class LoginUseCase {
  private userRepository: UserRepository;
  private jwtService: JwtManager;

  constructor(userRepository: UserRepository, jwtService = JwtManager.getInstance()) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute(email: string, password: string): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError({ message: 'User not found', code: 404 }, 'LoginUseCase.execute', 'Business');
    }

    // Validar la contraseña

    const match = await GeneralUtils.comparePassword(password, user.password, process.env.PEPPER);
    if (!match) {
      throw new CustomError({ message: 'Invalid credentials', code: 409 }, 'LoginUseCase.execute', 'Business');
    }

    // Generar el JWT
    const token = this.jwtService.generateToken({
      id: user.id,
      role: user.role,
    });
    return new ResponseBase(
      {
        code: 'OK',
        message: 'La consulta se ejecuto con éxito',
        status: 201,
      },
      { token },
    );
  }
}
