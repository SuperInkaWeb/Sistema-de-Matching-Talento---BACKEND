import {
  createRequestService,
  getMyRequestService,
  getAllRequestsService,
  resolveRequestService,
  getGlobalStatsService
} from '../services/company.request.service.js'
import {
  getAllUsers,
  getAllVacanciesAdmin
} from '../repositories/companies.requests.repository.js'

export const submitRequest = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const result = await createRequestService(userId, req.body)

    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'ALREADY_REQUESTED') {
      return res.status(400).json({ error: 'Ya tienes una solicitud pendiente' })
    }
    res.status(500).json({ error: err.message })
  }
}

export const getMyRequestController = async (req, res) => {
  try {
    const result = await getMyRequestService(req.dbUser.id)

    res.json(result || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getAllRequestsController = async (req, res) => {
  try {
    const result = await getAllRequestsService()

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const resolveRequestController = async (req, res) => {
  try {
    const { requestId } = req.params
    const { status } = req.body

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' })
    }
    const result = await resolveRequestService(requestId, status)
    res.json(result)
  } catch (err) {
    if (err.message === 'REQUEST_NOT_FOUND') {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.status(500).json({ error: err.message })
  }
}

export const getStatsController = async (req, res) => {
  try {
    const stats = await getGlobalStatsService()

    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getUsersController = async (req, res) => {
  try {
    const users = await getAllUsers()

    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getVacanciesAdminController = async (req, res) => {
  try {
    const vacancies = await getAllVacanciesAdmin()

    res.json(vacancies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
