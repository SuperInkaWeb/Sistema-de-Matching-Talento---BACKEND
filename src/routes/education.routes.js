import express from 'express'
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation
} from '../controllers/education.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.get(
  '/',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  getEducation
)

router.post(
  '/',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  addEducation
)

router.put(
  '/:id',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  updateEducation
)

router.delete(
  '/:id',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  deleteEducation
)

export default router
