import {
  createVacancyService,
  getAllActiveVacanciesService,
  getVacancyByIdService,
  updateVacancyService,
  deleteVacancyService,
  getMyCompanyVacanciesService,
  updateVacancyStatusService
} from '../services/vacancy.service.js'
import { awardPoints } from '../services/points.service.js'

export const createVacancy = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const vacancy = await createVacancyService(userId, req.body)
    await awardPoints(req.dbUser.id, 'CREATE_VACANCY')

    res.status(201).json(vacancy)
  } catch (error) {
    if (error.message === 'COMPANY_NOT_FOUND') {
      return res.status(404).json({
        error: 'Empresa no encontrada'
      })
    }
    console.error(error)
    res.status(500).json({
      error: 'Error creando vacante'
    })
  }
}

export const getAllActiveVacancies = async (req, res) => {
  try {
    const vacancies = await getAllActiveVacanciesService()
    res.json(vacancies)
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo vacantes' })
  }
}

export const getVacancyById = async (req, res) => {
  try {
    const vacancy = await getVacancyByIdService(req.params.id)
    res.json(vacancy)
  } catch (error) {
    if (error.message === 'VACANCY_NOT_FOUND') {
      return res.status(404).json({ error: 'Vacante no encontrada' })
    }
    res.status(500).json({ error: 'Error obteniendo vacante' })
  }
}

export const getMyCompanyVacancies = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const vacancies = await getMyCompanyVacanciesService(userId)

    res.status(200).json(vacancies)
  } catch (error) {
    if (error.message === 'COMPANY_NOT_FOUND') {
      return res.status(404).json({
        error: 'Compañía no encontrada'
      })
    }
    console.error(error)
    res.status(500).json({
      error: 'Error al obtener vacantes de la compañía'
    })
  }
}

export const updateVacancy = async (req, res) => {
  try {
    const vacancy = await updateVacancyService(
      req.params.id,
      req.body
    )

    res.json(vacancy)
  } catch (error) {
    if (error.message === 'VACANCY_NOT_FOUND') {
      return res.status(404).json({ error: 'Vacante no encontrada' })
    }
    res.status(500).json({ error: 'Error actualizando vacante' })
  }
}

export const deleteVacancy = async (req, res) => {
  try {
    const { vacancyId } = req.params
    const vacancy = await deleteVacancyService(vacancyId)

    res.status(200).json({
      message: 'Vacante eliminada',
      vacancy
    })
  } catch (error) {
    if (error.message === 'VACANCY_NOT_FOUND') {
      return res.status(404).json({
        error: 'Vacante no encontrada'
      })
    }
    console.error(error)
    res.status(500).json({
      error: 'Error eliminando vacante'
    })
  }
}

export const updateVacancyStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' })
    }
    const result = await updateVacancyStatusService(id, status)
    res.json(result)
  } catch (err) {
    if (err.message === 'VACANCY_NOT_FOUND') {
      return res.status(404).json({ error: 'Vacante no encontrada' })
    }
    res.status(500).json({ error: err.message })
  }
}
