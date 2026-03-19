import {
  createRequestService,
  verifyEmailService,
  getMyRequestService,
  getAllRequestsService,
  resolveRequestService,
  getGlobalStatsService
} from '../services/company.request.service.js'

export const submitRequest = async (req, res) => {
  try {
    const result = await createRequestService(req.dbUser.id, req.dbUser.email, req.body)
    res.status(201).json(result)
  } catch (err) {
    console.error('submitRequest error:', err.message)
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmailService(req.dbUser.id, req.body.code)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const getMyRequest = async (req, res) => {
  try {
    const result = await getMyRequestService(req.dbUser.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getAllRequests = async (req, res) => {
  try {
    const result = await getAllRequestsService()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const resolveRequest = async (req, res) => {
  try {
    const userEmail = req.body.userEmail || null
    const result = await resolveRequestService(req.params.requestId, req.body.status, userEmail)
    res.json(result)
  } catch (err) {
    console.error('resolveRequest error:', err.message)
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const getGlobalStats = async (req, res) => {
  try {
    const result = await getGlobalStatsService()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
