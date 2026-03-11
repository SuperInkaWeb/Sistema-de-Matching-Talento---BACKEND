import express from 'express'
import {
  applyToVacancy,
  getMyApplies,
  getApplicantsByVacancy,
  updateApplyStatusController
} from '../controllers/apply.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.post(
  '/:vacancyId',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  applyToVacancy
)

router.get(
  '/myvacancies',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  getMyApplies
)

router.get(
  '/applicants/vacancies/:vacancyId',
  checkJwt,
  syncUser,
  checkRole(['admin', 'company']),
  getApplicantsByVacancy
)

router.put(
  '/:applyId/status',
  checkJwt,
  syncUser,
  checkRole(['company', 'admin']),
  updateApplyStatusController
)

export default router
