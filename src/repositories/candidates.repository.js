import { pool } from '../database/connectionPostgreSQL.js'

export const findUserByAuth0Id = async (auth0Id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE auth0_id = $1',
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

export const createCandidateProfile = async (data) => {
  const result = await pool.query(
    `INSERT INTO candidates_profile
     (user_id, first_name, last_name, phone, city, country,
      linkedin_url, portfolio_url, resume_url, skills, experience_years)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      data.user_id,
      data.first_name,
      data.last_name,
      data.phone,
      data.city,
      data.country,
      data.linkedin_url,
      data.portfolio_url,
      data.resume_url,
      data.skills,
      data.experience_years
    ]
  )

  return result.rows[0]
}

export const updateCandidateProfile = async (userId, data) => {
  const result = await pool.query(
    `UPDATE candidates_profile
     SET first_name=$1,
         last_name=$2,
         phone=$3,
         city=$4,
         country=$5,
         linkedin_url=$6,
         portfolio_url=$7,
         resume_url=$8,
         skills=$9,
         experience_years=$10
     WHERE user_id=$11
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
      userId
    ]
  )

  return result.rows[0]
}
