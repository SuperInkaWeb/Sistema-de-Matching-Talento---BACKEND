import express from 'express'
import {
  sendInvitation,
  getInvitation,
  acceptInvitation,
  getMyInvitations,
  getAllInvitations
} from '../controllers/invitation.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.post(
  '/send',
  checkJwt,
  syncUser,
  sendInvitation
)

router.get(
  '/mine',
  checkJwt,
  syncUser,
  getMyInvitations
)

router.get(
  '/all',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getAllInvitations
)

router.get(
  '/:token',
  getInvitation
)

router.post(
  '/:token/accept',
  acceptInvitation
)

export default router
