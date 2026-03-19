import express from 'express'
import {
  submitRequest,
  getMyRequestController,
  getAllRequestsController,
  resolveRequestController,
  getStatsController,
  getUsersController,
  getVacanciesAdminController
} from '../controllers/admin.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.post(
  '/request',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  submitRequest
)

router.get(
  '/request/me',
  checkJwt,
  syncUser,
  checkRole(['candidate']),
  getMyRequestController
)

router.get(
  '/requests',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getAllRequestsController
)

router.put(
  '/requests/:requestId/resolve',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  resolveRequestController
)

router.get(
  '/stats',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getStatsController
)

router.get(
  '/users',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getUsersController
)

router.get(
  '/vacancies',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getVacanciesAdminController
)

export default router
