export const getProfile = (req, res) => {
  try {
    const user = req.dbUser

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      auth0_id: user.auth0_id
    })
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Error al obtener perfil'
    })
  }
}
