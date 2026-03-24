import express from 'express'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import {
  getMe,
  updateMyProfile
} from '../controllers/candidate.controller.js'
import { profileSchema } from '../validations/candidate.validator.js'

const router = express.Router()

router.get('/me', checkJwt, syncUser, getMe)

router.put(
  '/me/edit',
  checkJwt,
  syncUser,
  validate(profileSchema),
  updateMyProfile
)

export default router
