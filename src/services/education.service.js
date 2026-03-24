import {
  getEducationByProfileId,
  addEducation,
  updateEducation,
  deleteEducation
} from '../repositories/education.repository.js'
import { findCandidateProfile } from '../repositories/candidates.repository.js'

export const getEducationService = async (userId) => {
  const profile = await findCandidateProfile(userId)
  if (!profile) throw new Error('Perfil no encontrado')
  return await getEducationByProfileId(profile.id)
}

export const addEducationService = async (userId, data) => {
  const profile = await findCandidateProfile(userId)
  if (!profile) throw new Error('Perfil no encontrado')
  return await addEducation(profile.id, data)
}

export const updateEducationService = async (userId, educationId, data) => {
  const profile = await findCandidateProfile(userId)
  if (!profile) throw new Error('Perfil no encontrado')
  return await updateEducation(educationId, profile.id, data)
}

export const deleteEducationService = async (userId, educationId) => {
  const profile = await findCandidateProfile(userId)
  if (!profile) throw new Error('Perfil no encontrado')
  return await deleteEducation(educationId, profile.id)
}
