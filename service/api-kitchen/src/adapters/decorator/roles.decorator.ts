import 'reflect-metadata';
import { Erole } from '../../common/enum/role.enum';

// Decorador que asigna roles a las rutas
export function Roles(...roles: Erole[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('roles', roles, target, propertyKey);
  };
}
