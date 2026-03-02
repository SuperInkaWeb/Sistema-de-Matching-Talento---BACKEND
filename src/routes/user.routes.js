import { Router } from 'express'
import { register, login, syncUser } from '../controllers/user.controller.js'
import { checkJwt } from '../middleware/auth0.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/sync', checkJwt, syncUser)
export default router
