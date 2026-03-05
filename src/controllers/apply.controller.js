import {
  applyToVacancyService,
  getMyAppliesService,
  getApplicantsByVacancyService
} from '../services/apply.service.js'

export const applyToVacancy = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const { vacancyId } = req.params

    const apply = await applyToVacancyService(userId, vacancyId)

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
