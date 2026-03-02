import { body } from 'express-validator'

export const updateProfileValidator = [
  body('first_name').trim().notEmpty().withMessage('Nombre requerido'),
  body('last_name').trim().notEmpty().withMessage('Apellido requerido'),
  body('experience_years')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experiencia debe ser número positivo')
]
