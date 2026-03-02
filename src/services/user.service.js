import axios from 'axios'
import {
  findUserByAuth0Id,
  createUser
} from '../repositories/user.repository.js'

// Registro en Auth0
export const registerWithAuth0 = async (email, password) => {
  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      email,
      password,
      connection: 'Username-Password-Authentication'
    }
  )

  return response.data
}

// Login en Auth0
export const loginWithAuth0 = async (username, password) => {
  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      grant_type: 'client_credentials',
      username,
      password,
      audience: process.env.AUTH0_AUDIENCE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }
  )

  return response.data
}

// Obtener o crear usuario en PostgreSQL
export const getOrCreateUser = async (authUser) => {
  const { sub, email } = authUser

  if (!sub) {
    throw new Error('Token inválido: no contiene sub')
  }

  let user = await findUserByAuth0Id(sub)

  if (!user) {
    user = await createUser({
      auth0Id: sub,
      email
    })
  }

  return user
}
