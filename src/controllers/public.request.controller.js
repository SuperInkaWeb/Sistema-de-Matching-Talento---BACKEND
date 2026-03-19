import {
  sendPublicCodeService,
  verifyPublicCodeService,
  submitPublicRequestService
} from '../services/public.request.service.js'

export const sendPublicCode = async (req, res) => {
  try {
    const result = await sendPublicCodeService(req.body.email)
    res.json(result)
  } catch (err) {
    console.error('sendPublicCode error:', err.message)
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const verifyPublicCode = async (req, res) => {
  try {
    const result = await verifyPublicCodeService(req.body.email, req.body.code)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const submitPublicRequest = async (req, res) => {
  try {
    const result = await submitPublicRequestService(req.body)
    res.status(201).json(result)
  } catch (err) {
    console.error('SubmitPublicRequest error:', err.message)
    res.status(err.status || 500).json({ error: err.message })
  }
}
