import { Router } from 'express'
import { checkJwt } from '../middleware/auth0.middleware.js'
import { getMe, updateMyProfile } from '../controllers/candidate.controller.js'
import { updateProfileValidator } from '../validations/candidate.validator.js'
import { validationResult } from 'express-validator'

const router = Router()

router.get('/me', checkJwt, getMe)

router.put(
  '/me/profile',
  checkJwt,
  updateProfileValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  updateMyProfile
)

export default router
