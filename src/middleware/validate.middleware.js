export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body)

      req.body = validatedData

      next()
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          message: 'Errores de validación',
          errors: error.array()
        })
      }

      return res.status(500).json({
        message: 'Error interno de validación'
      })
    }
  }
}
