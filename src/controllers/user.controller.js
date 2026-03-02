import {
  registerWithAuth0,
  loginWithAuth0,
  getOrCreateUser
} from '../services/user.service.js'

// Registro en Auth0
export const register = async (req, res) => {
  try {
    const { email, password } = req.body

    const data = await registerWithAuth0(email, password)

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      error: error.response?.data || 'Error en registro'
    })
  }
}

// Login en Auth0
export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const data = await loginWithAuth0(username, password)

    res.status(200).json(data)
  } catch (error) {
    res.status(401).json({
      error: error.response?.data || 'Error en login'
    })
  }
}

// Sync usuario con PostgreSQL usa el token ya validado
export const syncUser = async (req, res) => {
  try {
    const authUser = req.auth.payload

    const user = await getOrCreateUser(authUser)

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Error al sincronizar usuario'
    })
  }
}
