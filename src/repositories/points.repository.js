import { pool } from '../database/connectionSupabase.js'

const currentMonth = () => new Date().toISOString().slice(0, 7)

export const addPoints = async (userId, action, points, description = '') => {
  const month = currentMonth()

  await pool.query(
    `INSERT INTO points (user_id, points, month)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, month)
     DO UPDATE SET points = points.points + $2, updated_at = NOW()`,
    [userId, points, month]
  )

  await pool.query(
    `INSERT INTO points_history (user_id, action, points, description)
     VALUES ($1, $2, $3, $4)`,
    [userId, action, points, description]
  )
}

export const getMonthlyPoints = async (userId) => {
  const month = currentMonth()
  const result = await pool.query(
    'SELECT points FROM points WHERE user_id = $1 AND month = $2',
    [userId, month]
  )
  return parseInt(result.rows[0]?.points || 0)
}

export const getPointsHistory = async (userId, limit = 10) => {
  const result = await pool.query(
    'SELECT * FROM points_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  )
  return result.rows
}

export const hasEarnedPoints = async (userId, action) => {
  const month = currentMonth()
  const result = await pool.query(
    `SELECT id FROM points_history
     WHERE user_id = $1 AND action = $2
     AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`,
    [userId, action]
  )
  return result.rows.length > 0
}

export const getTopCandidatesByPoints = async (limit = 50) => {
  const month = currentMonth()
  const result = await pool.query(
    `SELECT p.user_id, p.points, cp.first_name, cp.last_name,
            cp.skills, cp.experience_years, cp.city, cp.country, cp.languages
     FROM points p
     JOIN candidates_profile cp ON cp.user_id = p.user_id
     WHERE p.month = $1
     ORDER BY p.points DESC
     LIMIT $2`,
    [month, limit]
  )
  return result.rows
}

export const getTopCompaniesByPoints = async (limit = 50) => {
  const month = currentMonth()
  const result = await pool.query(
    `SELECT p.user_id, p.points, c.company_name, c.industry,
            c.city, c.country, c.description
     FROM points p
     JOIN companies c ON c.user_id = p.user_id
     WHERE p.month = $1
     ORDER BY p.points DESC
     LIMIT $2`,
    [month, limit]
  )
  return result.rows
}

export const checkVacancyApplicantMilestone = async (vacancyId, companyUserId) => {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM applies WHERE vacancy_id = $1',
    [vacancyId]
  )
  const count = parseInt(result.rows[0].count)
  const milestones = [5, 10, 20]
  const milestone = milestones.find(m => count === m)

  if (milestone) {
    const already = await hasEarnedPoints(companyUserId, `milestone_${milestone}_vacancy_${vacancyId}`)
    if (!already) {
      await addPoints(companyUserId, `milestone_${milestone}_vacancy_${vacancyId}`, 20,
        `${milestone} postulantes en una vacante`)
    }
  }

  if (count >= 50 && count % 50 === 0) {
    const action = `milestone_${count}_vacancy_${vacancyId}`
    const already = await hasEarnedPoints(companyUserId, action)
    if (!already) {
      await addPoints(companyUserId, action, 100, `${count} postulantes en una vacante`)
    }
  }
}
