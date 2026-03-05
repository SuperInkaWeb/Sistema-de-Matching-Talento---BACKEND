import {
  findUserByAuth0Id,
  findCandidateProfile,
  createCandidateProfile,
  updateCandidateProfile
} from '../repositories/candidates.repository.js'

export const getMeService = async (auth0Id) => {
  const user = await findUserByAuth0Id(auth0Id)

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  let profile = null

  if (user.role === 'candidate') {
    profile = await findCandidateProfile(user.id)
  }

  return { user, profile }
}

export const updateProfileService = async (auth0Id, data) => {
  const user = await findUserByAuth0Id(auth0Id)

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.status = 404
    throw error
  }

  const existingProfile = await findCandidateProfile(user.id)

  if (!existingProfile) {
    return await createCandidateProfile(user.id, data)
  }

  return await updateCandidateProfile(user.id, data)
}
