export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.dbUser.role)) {
      return res.status(403).json({
        error: 'No autorizado'
      })
    }

    next()
  }
}
