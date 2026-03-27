import {
  addPoints,
  getMonthlyPoints,
  getPointsHistory,
  hasEarnedPoints,
  getTopCandidatesByPoints,
  getTopCompaniesByPoints,
  checkVacancyApplicantMilestone
} from '../repositories/points.repository.js'

export const POINTS = {
  APPLY: { action: 'apply', pts: 5, desc: 'Postulación enviada' },
  UPLOAD_CV: { action: 'upload_cv', pts: 50, desc: 'CV subido' },
  COMPLETE_PROFILE: { action: 'complete_profile', pts: 50, desc: 'Perfil completado al 100%' },
  INVITE_USER: { action: 'invite_user', pts: 20, desc: 'Usuario invitado' },
  CREATE_VACANCY: { action: 'create_vacancy', pts: 30, desc: 'Vacante publicada' }
}

export const isProfileComplete = (profile) => {
  if (!profile) return false
  const fields = ['first_name', 'last_name', 'phone', 'city', 'country', 'skills', 'experience_years']
  return fields.every(f => profile[f]) &&
    profile.resume_url &&
    Array.isArray(profile.languages)
    ? profile.languages.length > 0
    : !!profile.languages
}

export const awardPoints = async (userId, type) => {
  const { action, pts, desc } = POINTS[type]
  const already = await hasEarnedPoints(userId, action)
  if (already && ['upload_cv', 'complete_profile'].includes(action)) return
  await addPoints(userId, action, pts, desc)
}

export const getMyPointsService = async (userId) => {
  const [points, history] = await Promise.all([
    getMonthlyPoints(userId),
    getPointsHistory(userId)
  ])
  return { points, history }
}

export const checkAndAwardMilestone = async (vacancyId, companyUserId) => {
  await checkVacancyApplicantMilestone(vacancyId, companyUserId)
}

export const getLeaderboardService = async () => {
  const [candidates, companies] = await Promise.all([
    getTopCandidatesByPoints(),
    getTopCompaniesByPoints()
  ])
  return { candidates, companies }
}
