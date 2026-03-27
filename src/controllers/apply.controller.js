import {
  applyToVacancyService,
  getMyAppliesService,
  getApplicantsByVacancyService,
  updateApplyStatus
} from '../services/apply.service.js'
import { awardPoints, checkAndAwardMilestone } from '../services/points.service.js'
import { getVacancyById } from '../repositories/vacancies.repository.js'
import { pool } from '../database/connectionSupabase.js'

export const applyToVacancy = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const { vacancyId } = req.params
    const apply = await applyToVacancyService(userId, vacancyId)
    const vacancy = await getVacancyById(vacancyId)
    await awardPoints(req.dbUser.id, 'APPLY')

    if (vacancy) {
      const companyUser = await pool.query(
        'SELECT u.id FROM users u JOIN companies c ON c.user_id = u.id WHERE c.id = $1',
        [vacancy.company_id]
      )
      if (companyUser.rows[0]) {
        await checkAndAwardMilestone(vacancyId, companyUser.rows[0].id)
      }
    }
    res.status(201).json(apply)
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Ya aplicaste a esta vacante'
      })
    }

    if (error.message === 'CANDIDATE_PROFILE_NOT_FOUND') {
      return res.status(404).json({
        error: 'Perfil de candidato no encontrado'
      })
    }
    console.error(error)
    res.status(500).json({
      error: 'Error al aplicar a la vacante'
    })
  }
}

export const getMyApplies = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const applies = await getMyAppliesService(userId)

    res.json(applies)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error obteniendo postulaciones'
    })
  }
}

export const getApplicantsByVacancy = async (req, res) => {
  try {
    const { vacancyId } = req.params
    const applicants = await getApplicantsByVacancyService(vacancyId)

    res.status(200).json(applicants)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error obteniendo postulantes'
    })
  }
}

export const updateApplyStatusController = async (req, res) => {
  try {
    const { applyId } = req.params
    const { status } = req.body

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' })
    }
    const result = await updateApplyStatus(applyId, status)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
