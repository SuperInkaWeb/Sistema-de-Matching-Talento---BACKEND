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

export const upsertCandidateProfileService = async (auth0Id, profileData) => {
  const user = await findUserByAuth0Id(auth0Id)

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  if (user.role !== 'candidate') {
    throw new Error('FORBIDDEN')
  }

  const existingProfile = await findCandidateProfile(user.id)

  if (existingProfile) {
    return await updateCandidateProfile(user.id, profileData)
  }

  return await createCandidateProfile({
    user_id: user.id,
    ...profileData
  })
}
