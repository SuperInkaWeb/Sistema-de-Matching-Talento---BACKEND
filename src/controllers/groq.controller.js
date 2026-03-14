import { getTopVacanciesForCandidate, getTopCandidatesForVacancy } from '../services/groq.service.js'
import { findCandidateProfile } from '../repositories/candidates.repository.js'
import {
  getAllActiveVacancies,
  getVacancyById
} from '../repositories/vacancies.repository.js'
import { getApplicantsByVacancy } from '../repositories/applies.repository.js'

export const recommendVacancies = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const candidate = await findCandidateProfile(userId)
    if (!candidate) return res.status(404).json({ error: 'Perfil no encontrado' })

    const vacancies = await getAllActiveVacancies()
    if (!vacancies.length) return res.json({ recommendations: [] })

    const result = await getTopVacanciesForCandidate(candidate, vacancies)
    res.json(result)
  } catch (err) {
    console.error('recommendVacancies error:', err.message)
    res.status(500).json({ error: err.message })
  }
}

export const recommendCandidates = async (req, res) => {
  try {
    const { vacancyId } = req.params
    const vacancy = await getVacancyById(vacancyId)
    if (!vacancy) return res.status(404).json({ error: 'Vacante no encontrada' })

    const candidates = await getApplicantsByVacancy(vacancyId)
    if (!candidates.length) return res.json({ recommendations: [] })

    const result = await getTopCandidatesForVacancy(vacancy, candidates)
    res.json(result)
  } catch (err) {
    console.error('recommendCandidates error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
