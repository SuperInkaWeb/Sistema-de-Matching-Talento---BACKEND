import express from 'express'
import {
  getMyPoints,
  getLeaderboard
} from '../controllers/points.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'

const router = express.Router()

router.get(
  '/me',
  checkJwt,
  syncUser,
  getMyPoints
)

router.get(
  '/leaderboard',
  getLeaderboard
)

export default router
