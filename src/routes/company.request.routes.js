import express from 'express'
import {
  submitRequest,
  verifyEmail,
  getMyRequest,
  getAllRequests,
  resolveRequest,
  getGlobalStats
} from '../controllers/company.request.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.post(
  '/submit',
  checkJwt,
  syncUser,
  submitRequest
)

router.post(
  '/verify',
  checkJwt,
  syncUser,
  verifyEmail
)

router.get(
  '/me',
  checkJwt,
  syncUser,
  getMyRequest
)

router.get(
  '/all',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getAllRequests
)

router.put(
  '/:requestId/resolve',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  resolveRequest
)

router.get(
  '/stats',
  checkJwt,
  syncUser,
  checkRole(['admin']),
  getGlobalStats
)

router.get('/check-ruc/:ruc', checkJwt, syncUser, async (req, res) => {
  try {
    const { getRucInfo } = await import('../services/sunat.service.js')
    const data = await getRucInfo(req.params.ruc)
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router

router.get('/public/check-ruc/:ruc', async (req, res) => {
  try {
    const { getRucInfo } = await import('../services/sunat.service.js')
    const data = await getRucInfo(req.params.ruc)
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})
