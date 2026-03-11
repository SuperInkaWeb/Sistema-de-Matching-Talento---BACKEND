import {
  createApply,
  getAppliesByCandidate,
  getApplicantsByVacancy,
  updateApplyStatus as updateApplyStatusRepo
} from '../repositories/applies.repository.js'
import { findCandidateProfile } from '../repositories/candidates.repository.js'

export const applyToVacancyService = async (userId, vacancyId) => {
  const candidateProfile = await findCandidateProfile(userId)

  if (!candidateProfile) {
    throw new Error('CANDIDATE_PROFILE_NOT_FOUND')
  }

  return await createApply(candidateProfile.id, vacancyId)
}

export const getMyAppliesService = async (userId) => {
  const candidateProfile = await findCandidateProfile(userId)

  if (!candidateProfile) {
    throw new Error('CANDIDATE_PROFILE_NOT_FOUND')
  }

  return await getAppliesByCandidate(candidateProfile.id)
}

export const getApplicantsByVacancyService = async (vacancyId) => {
  const applicants = await getApplicantsByVacancy(vacancyId)

  return applicants
}

export const updateApplyStatus = async (applyId, status) => {
  return await updateApplyStatusRepo(applyId, status)
}
