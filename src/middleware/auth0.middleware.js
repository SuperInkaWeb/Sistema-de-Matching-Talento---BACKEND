import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import axios from 'axios'
import { getOrCreateUser } from '../services/user.service.js'

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],

  requestProperty: 'user'
})

export const syncUser = async (req, res, next) => {
  try {
    const authUser = req.user.sub
    const userInfoResponse = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`
        }
      }
    )

    const email = userInfoResponse.data.email

    const user = await getOrCreateUser({
      sub: authUser,
      email
    })

    req.dbUser = user

    next()
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Error al sincronizar usuario'
    })
  }
}
