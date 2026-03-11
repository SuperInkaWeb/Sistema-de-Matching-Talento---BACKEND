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
    const token = req.headers.authorization.split(' ')[1]
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )

    const user = await getOrCreateUser({
      sub: payload.sub,
      email: payload.email || payload.email || null,
      name: payload.name || null,
      picture: payload.picture || null
    })

    req.dbUser = user
    next()
  } catch (error) {
    console.error('syncUser error:', error)
    res.status(500).json({ error: error.message || 'Error al sincronizar usuario' })
  }
}
