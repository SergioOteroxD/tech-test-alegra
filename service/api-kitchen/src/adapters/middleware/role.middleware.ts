import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { Erole } from '../../common/enum/role.enum';

// Middleware mejorado para leer roles de la metadata
export function checkRolesFromMetadata(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requiredRoles: Erole[] = Reflect.getMetadata(
    'roles',
    req?.controller,
    req.method
  );
  if (!requiredRoles) {
    next(); // No se especificaron roles, seguir al siguiente middleware
  }

  const userRoles = req.user?.role || [];
  const hasRole = requiredRoles.some((role) => role == userRoles);

  if (!hasRole) {
    res.status(403).json({ message: 'No tiene permisos suficientes' });
  }
  next();
}
