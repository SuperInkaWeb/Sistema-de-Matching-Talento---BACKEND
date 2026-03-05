import express from 'express'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import {
  createCompany,
  getMyCompany,
  updateCompany,
  deleteCompany
} from '../controllers/company.controller.js'

const router = express.Router()

router.post(
  '/create',
  checkJwt,
  syncUser,
  createCompany
)

router.get(
  '/me',
  checkJwt,
  syncUser,
  getMyCompany
)

router.put(
  '/edit',
  checkJwt,
  syncUser,
  updateCompany
)

router.delete(
  '/delete',
  checkJwt,
  syncUser,
  deleteCompany
)

export default router
