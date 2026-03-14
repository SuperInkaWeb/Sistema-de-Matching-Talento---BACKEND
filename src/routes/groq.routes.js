import express from 'express'
import {
  recommendVacancies,
  recommendCandidates
} from '../controllers/groq.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.get(
  '/recommend/vacancies',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  recommendVacancies
)

router.get(
  '/recommend/candidates/:vacancyId',
  checkJwt,
  syncUser,
  checkRole(['company', 'admin']),
  recommendCandidates
)

export default router
