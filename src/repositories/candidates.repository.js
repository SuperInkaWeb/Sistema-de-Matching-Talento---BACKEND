import { pool } from '../database/connectionSupabase.js'

export const findUserByAuth0Id = async (auth0Id) => {
  const result = await pool.query(
    `SELECT u.id, u.email, u.role, u.name, u.picture, u.created_at,
            p.first_name, p.last_name, p.phone, p.city, p.country,
            p.linkedin_url, p.portfolio_url, p.resume_url,
            p.skills, p.experience_years
     FROM users u
     LEFT JOIN candidates_profile p ON p.user_id = u.id
     WHERE u.auth0_id = $1`,
    [auth0Id]
  )
  return result.rows[0]
}

export const findCandidateProfile = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM candidates_profile WHERE user_id = $1',
    [userId]
  )
  return result.rows[0]
}

export const createCandidateProfile = async (userId, data) => {
  const languagesArray = data.languages
    ? (typeof data.languages === 'string'
        ? data.languages.split(',').map(l => l.trim()).filter(Boolean)
        : data.languages)
    : []

  const result = await pool.query(
    `INSERT INTO candidates_profile
     (user_id, first_name, last_name, phone, city, country,
      linkedin_url, portfolio_url, resume_url, skills, experience_years, languages, address)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      userId,
      data.first_name,
      data.last_name,
      data.phone,
      data.city,
      data.country,
      data.linkedin_url,
      data.portfolio_url,
      data.resume_url,
      data.skills,
      data.experience_years,
      languagesArray,
      data.address
    ]
  )
  return result.rows[0]
}

export const updateCandidateProfile = async (userId, data) => {
  const languagesArray = data.languages
    ? (typeof data.languages === 'string'
        ? data.languages.split(',').map(l => l.trim()).filter(Boolean)
        : data.languages)
    : []

  const result = await pool.query(
    `UPDATE candidates_profile
     SET first_name=$1, last_name=$2, phone=$3, city=$4, country=$5,
         linkedin_url=$6, portfolio_url=$7, resume_url=$8, skills=$9,
         experience_years=$10, languages=$11, address=$12
     WHERE user_id=$13
     RETURNING *`,
    [
      data.first_name,
      data.last_name,
      data.phone,
      data.city,
      data.country,
      data.linkedin_url,
      data.portfolio_url,
      data.resume_url,
      data.skills,
      data.experience_years,
      languagesArray,
      data.address,
      userId
    ]
  )
  return result.rows[0]
}

export const updateResumeUrl = async (userId, resumeUrl) => {
  const query = `
    UPDATE candidates_profile
    SET resume_url = $1
    WHERE user_id = $2
    RETURNING *;
  `

  const values = [resumeUrl, userId]
  const result = await pool.query(query, values)

  return result.rows[0]
}
