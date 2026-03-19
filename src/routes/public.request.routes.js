import express from 'express'
import {
  sendPublicCode,
  verifyPublicCode,
  submitPublicRequest
} from '../controllers/public.request.controller.js'
import { getRucInfo } from '../services/sunat.service.js'

const router = express.Router()

router.post('/send-code', sendPublicCode)

router.post('/verify-code', verifyPublicCode)

router.post('/submit', submitPublicRequest)

router.get('/check-ruc/:ruc', async (req, res) => {
  try {
    const data = await getRucInfo(req.params.ruc)
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
