import { Router } from 'express'
import {
  createVacancy,
  getAllVacancies,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
  getMyCompanyVacancies
} from '../controllers/vacancy.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = Router()

router.post(
  '/create',
  checkJwt,
  syncUser,
  checkRole('company', 'admin'),
  createVacancy
)

router.get(
  '/all',
  getAllVacancies
)

router.get(
  '/:id',
  getVacancyById
)

router.get(
  '/vac/company/me',
  checkJwt,
  syncUser,
  checkRole('company'),
  getMyCompanyVacancies
)

router.put(
  '/edit/:id',
  checkJwt,
  syncUser,
  checkRole('company', 'admin'),
  updateVacancy
)

router.delete(
  '/del/:vacancyId',
  checkJwt,
  syncUser,
  checkRole('company', 'admin'),
  deleteVacancy
)

export default router
