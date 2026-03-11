import { Router } from 'express'
import { getProfile } from '../controllers/user.controller.js'
import { checkJwt, syncUser } from '../middleware/auth0.middleware.js'

const router = Router()

router.get('/profile', checkJwt, syncUser, getProfile)

export default router
