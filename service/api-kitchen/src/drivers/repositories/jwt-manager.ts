import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { config } from '../../common/config';

export class JwtManager {
  private static instance: JwtManager;
  private secret: string;
  private expiresIn: StringValue;

  private constructor() {
    // Carga el secret desde una variable de entorno
    this.secret = config.jwtSecret;

    this.expiresIn = config.jwtExpire;
  }

  // Método para obtener la instancia única
  public static getInstance(): JwtManager {
    if (!JwtManager.instance) {
      JwtManager.instance = new JwtManager();
    }
    return JwtManager.instance;
  }

  // Método para generar un token
  public generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  // Método para verificar un token
  public verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }

  // Método para decodificar un token sin verificar
  public decodeToken(token: string): null | { [key: string]: any } | string {
    return jwt.decode(token);
  }
}
