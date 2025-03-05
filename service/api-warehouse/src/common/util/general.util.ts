import * as bcrypt from 'bcrypt';
import { CustomError } from '../types/custom-error';

export class GeneralUtils {
  public static async encryptPassword(
    password: string,
    pepper?: string
  ): Promise<string> {
    try {
      // Generamos un salt aleatorio para mejorar la seguridad
      const salt = await bcrypt.genSalt(10);

      // Concatenamos la contraseña y el pepper
      const pepperedPassword = password + pepper;

      // Encriptamos la contraseña con el salt y el pepper
      const hash = await bcrypt.hash(pepperedPassword, salt);

      // Devolvemos la contraseña encriptada
      return hash;
    } catch (error) {
      throw new CustomError(
        { code: 500, message: 'ERROR' },
        'GeneralUtils.encryptPassword',
        'Technical',
        error
      );
    }
  }

  public static async comparePassword(
    password: string,
    hash: string,
    pepper: any
  ): Promise<boolean> {
    // Concatenamos la contraseña y el pepper
    const pepperedPassword = password + pepper;

    // Comparamos la contraseña con su versión encriptada con el pepper
    const match = await bcrypt.compare(pepperedPassword, hash);

    // Devolvemos true si las contraseñas coinciden, false en caso contrario
    return match;
  }

}
