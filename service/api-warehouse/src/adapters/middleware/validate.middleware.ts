const { validationResult } = require('express-validator');

export const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Asegúrate que los valores estén bien',
      status: 400,
      data: { errors: errors.array() },
    });
  }

  // Si no hay errores, continuar con el siguiente middleware o controlador
  next();
};
