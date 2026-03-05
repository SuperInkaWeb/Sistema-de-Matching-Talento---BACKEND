import {
  registerWithAuth0,
  loginWithAuth0
} from '../services/user.service.js'

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
